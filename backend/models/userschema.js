const mdb = require('mongoose')
const UserSchema = new mdb.Schema({
    email: String,
    score: Number,
  });
  
const User = mdb.model("User", UserSchema);
module.exports=User;