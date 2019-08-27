const mongoose=require('mongoose');

const empSchema=mongoose.Schema({
  eid:Number,
  ename:String,
  salary:Number
  });

module.exports=mongoose.model('Employee',empSchema) ;
