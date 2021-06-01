const express = require('express');
const User = require('./models/user');
require('./db/mongoose')


const app = express();
app.use(express.json()) //this lets you take the incoming items as json.

const PORT = process.env.PORT || 3000

app.post('/signup',(req, res)=>{
    const user = new User(req.body)

    user.save().then((usr)=>{
        res.status(201).send("User has been signed up."+ usr)
    }).catch((err)=>{
        res.status(400).send("Couldnt add user details."+ err)
    })
})

app.get('/user/:id',(req, res)=>{
    const _id = req.params.id; 
    
    User.findById(_id).then((user)=>{
        if(!user){                        // doing this because finding no user is not an error, the code has run properly.
            return res.send("Couldnt read user")
        }
        res.send("User found." + user)
    }).catch((error)=>{
        res.send("Well, got an error while reading user." + error);
    }) 
});

app.listen(PORT, ()=>{
    console.log("Server listening at ", PORT);
});