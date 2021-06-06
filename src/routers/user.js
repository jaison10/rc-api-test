const express = require('express')
const { User } = require('../models/user')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')

var expresss = require('express');
app = expresss()
app.use(expresss.static('public'));


const router  = new express.Router()  // creating a router. 

router.get('/', auth, (req, res)=>{
    res.sendFile('./public/index.html', { root: __dirname })
})

router.post('/signup',  async (req, res)=>{ 
    const user = new User(req.body)

    try{
        await user.save();  //this looks synchronous even thou it is asynchronous.
        const token = await user.generateAuthToken()  // generating token on signing up.
        res.status(201).send({ "User has been signed up. ":user, token})  // this wont work if there is an error. Thats how it is dealing with promises.
    }catch(e){
        res.status(400).send("Couldnt add user details."+ e)
    }
})

// router.get('/login', auth, (req, res)=>{
//     res.send("LOGGED In")
// })

router.post('/login', async (req, res)=>{
    
    try{
        const email = req.body.email;
        const user =  await User.findOne({ email })
        if(!user){
            return res.status(404).send("No user found with this email.")
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(!isMatch){
            return res.status(400).send("Invalid password, cannot login.")
        }
        const token = await user.generateAuthToken()  // generating token on signing in.
        // res.send( { "logged In ": user.getPublicProfile(), token})
        // OR
        res.send({"Logged In": user, token})
        

    }catch(e){
        res.status(500).send("Some error. : "+ e)
    }
})

router.get('/user/me', auth , (req,res)=>{
    res.send(req.user)  // this req.user is obtained from auth.js. Neednt do any try,catch thing bcs it is done there.
})


router.patch('/update/me', auth ,async (req, res)=>{
    // Making sure that we are letting the user update only the properties allowed. By default if non allowed are incoming, it will be ignored.
    // But we can return something in that case. That's why doing all this.
    const incomingUpdates = Object.keys(req.body);
    const allowed = ["name","email","password"];
    const isValid = incomingUpdates.every((update)=>{  // returns true if the conditions in body is valid for all 
        return allowed.includes(update)
    })
    if(!isValid){
        return res.status(404).send("Trying to update non allowed property.")
    }

    try{
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true } );
        // const user = await User.findById(req.params.id) // doing this method instead of above is the above one by passes the middleware, but we want middleware.
        
        // not using above user is bcs we are getting user from auth, which is stored in req.user
        
        incomingUpdates.forEach((update)=> req.user[update] = req.body[update]);
        await req.user.save()  // bcs middleware is applied for save.

        res.status(200).send({"updated":req.user});
    }catch(e){
        res.status(400).send("error:  " + e);
    }
})

router.post('/logout', auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send("Logged out")
    }catch(e){
        res.status(500).send("Couldnt logout")
    }
})

router.post('/logoutAll', auth, async(req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()

        res.send("Logged out from all accounts.")
    }catch(e){
        res.status(500).send("Couldnt logout")
    }
})

router.delete('/delete/me', auth ,async(req, res)=>{
    try{
        // const userr = await User.findByIdAndDelete(req.user._id);
        // if(!userr){
        //     return res.status(404).send("There is no such a user")
        // }

        // INSTEAD

        await req.user.remove()   // mongoose provides this. Similar to save. This removes.
        res.status(200).send("User has been deleted");
    }catch(e){
        res.status(500).send("error:  " + e);
    }
})

module.exports = router;