const mongoose =  require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({  // schema lets use take advantage of middleware.
    name:{
        type: String,
        required: true,
        trim : true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password:{
        type : String,
        required: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("Password must not contain the word password.")
            }
        },
        minlength: 6
    },
    tokens:[{
        token:{   // saving tokens as an array so that they can login from multiple systems.
            type: String, 
            required: true
        }
    }]
})

// userSchema.methods.getPublicProfile =  function(){
//     const user = this
//     const userObject = user.toObject()  // creates an object which can be edited

//     delete userObject.tokens   // removes tokens array
//     delete userObject.password

//     return userObject
// }

// OR

userSchema.methods.toJSON =  function(){
    const user = this
    const userObject = user.toObject()  // creates an object which can be edited

    delete userObject.tokens   // removes tokens array
    delete userObject.password

    return userObject
}

var tokentemp

userSchema.methods.generateAuthToken = async function(){
    const user = this  // this will have 'user' since this fun was called as user.generateAuthToken()
    const token = jwt.sign({ _id:user._id.toString() }, 'hackthistokenifyoucan')

    tokentemp = token   // this is used to keep track of current user/the user in this system
    // console.log(tokentemp);

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.pre('save', async function(next){  // this is how we use middleware. 'pre' is used bcs we want to use middleware before saving data.
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)  // 8 is no. of times hash algo needs to run. Its a balanced no.
    }

    next()
})

function getToken(){
    // console.log("came here");
    // console.log(tokentemp);
    return tokentemp                // returning token of the current logged user in this system.
}

const User = mongoose.model( 'User', userSchema)

module.exports = { User, getToken }