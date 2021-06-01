const mongoose =  require('mongoose');
const validator = require('validator');

const User = mongoose.model( 'User',{
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
    }
})

module.exports = User;