const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const EmployeeAddSchema=Schema({
  eid:String,
      city:String,
      state:String

});
module.exports=mongoose.model('EmployeeAddress',EmployeeAddSchema);
