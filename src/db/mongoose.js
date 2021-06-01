const mongoose =  require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/rc-manglore-api',{ useNewUrlParser : true, useCreateIndex : true });

const user = mongoose.model( 'User',{
    name:{
        type: String,
        required: true,
        trim : true
    },
    mail:{
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

const me = new user({
    name: "   Jaison3",
    mail: "JAjaisonm@gmail.com   ",
    password : "Password"
})

me.save().then((me)=>{
    console.log("Data pushed", me);
}).catch((err)=>{
    console.log("Couldnt push data", err);
});

