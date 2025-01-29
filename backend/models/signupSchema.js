const mdb = require('mongoose')
const signupSchema=mdb.Schema({
    username:  String ,
    email:  String ,
    password: String, 
    score:{type:Number ,default:0},
   

})
const signup_schema=mdb.model("signup",signupSchema)
module.exports=signup_schema; 

