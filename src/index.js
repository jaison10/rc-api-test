const express = require('express');
require('./db/mongoose')  // importing to make the database run along.
const userRouter = require('./routers/user')


const app = express();
app.use(express.json()) //this lets you take the incoming items as json.

app.use(userRouter)  // without registering, you cant use router. router is similar to app. Has get, post etc.

const PORT = process.env.PORT || 3000


app.listen(PORT, ()=>{
    console.log("Server listening at ", PORT);
});