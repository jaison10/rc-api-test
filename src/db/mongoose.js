const mongoose =  require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/rc-manglore-api',{ useNewUrlParser : true, useCreateIndex : true });

// me.save().then((me)=>{
//     console.log("Data pushed", me);
// }).catch((err)=>{
//     console.log("Couldnt push data", err);
// });

