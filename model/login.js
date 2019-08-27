const mongoose=require('mongoose');

const loginSchema=mongoose.Schema({
  userid:String,
  password:String,
  });

module.exports=mongoose.model('Login',loginSchema) ;
