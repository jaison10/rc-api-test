const mongoose =  require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/rc-manglore-api',
    { useNewUrlParser : true, 
        useCreateIndex : true,
        useFindAndModify : false // this is to avoid the warnings we get related to mongoose and mongodb. We get warnings bcs some things that has been modified by mngodb might not have applied in mongoose. It takes some more time.

    });

// me.save().then((me)=>{
//     console.log("Data pushed", me);
// }).catch((err)=>{
//     console.log("Couldnt push data", err);
// });

