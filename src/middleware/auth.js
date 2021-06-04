const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next)=>{

    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        // console.log("token is ",token);
        const decoded = jwt.verify(token, 'hackthistokenifyoucan')
        // console.log("decoded: ", decoded);
        const user = await User.findOne({ _id:decoded._id, 'tokens.token':token })  //checking if the token passed is in tokens array
        // console.log("user is: ", user);
        if(!user){
            throw new Error
        }

        req.token = token  // an extra field to store the current token so that the same will be used while logging out.
        req.user = user   // extra field to store user data, so that it can be used in router, neednt find user there again.
        next()
    }catch(e){
        res.status(401).send({"Error : Please authenticate":e})
    }

}
module.exports = auth