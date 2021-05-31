// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = "mongodb://127.0.0.1:27017";
const database = "rc-test-new";

const id = new ObjectID();  // this id will have first few char specifiying the time when it was created.
console.log(id);
console.log(id.id.length);
console.log(id.toHexString().length);

MongoClient.connect(connectionURL, { useNewUrlParser : true }, (error, client)=>{
    if(error){
        return console.log("Unable to connect to DB");
    }
    console.log("Connect successfully.");
    const db = client.db(database)

    db.collection('users').insertOne({
        _id : id,
        name :"Jaison",
        mail :"jaisonj1@gmail.com",
    },(err, res)=>{
        if(err){
            return console.log("Failed to insert.");
        }
        console.log(res.ops);
    });

    // Fetch by ID
    db.collection('users').findOne({ _id: new ObjectID("60b540cda8cb3a1f00c0d0d3")},(err, user)=>{
        if(err){
            return console.log("No user found.");
        }
        console.log(user);
    });

    //  Fetch multiple : if there are many.
    db.collection('users').find({ age: 26 }).toArray((err, users)=>{
        if(err){
            return console.log("No user found.");
        }
        console.log(users);
    })
    // Update
    db.collection('users').updateOne({
        _id: new ObjectID("60b540cda8cb3a1f00c0d0d3")
    },{
        $set: {
            name:"Jaison DSouza"
        }
    }).then(()=>{
        console.log("Updated");
    }).catch((err)=>{
        console.log("Couldnt update");
    });
    // Delete
    db.collection('users').deleteOne({
        _id: new ObjectID("60b549cd5616a131d04da21f")
    }).then(()=>{
        console.log("Deleted");
    }).catch((err)=>{
        console.log("Couldnt delete");
    });

});

