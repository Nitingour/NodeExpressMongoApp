const express=require('express');
const app=express();


app.listen(3000,()=>{
  console.log("Server started....");
});

//congigure view engine :Hbs
var path=require('path');
app.set('views',path.join(__dirname,'views')); //location
app.set('view engine','hbs');//extension

//configure body parser
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

app.get('/',(request,response)=>{
response.render('login');
});

const Employee=require('./model/employee');
const Login=require('./model/login');
const URL="mongodb://localhost:27017/EMSDB";
//const URL="mongodb+srv://nitin:12345@cluster0-r61ra.mongodb.net/test?retryWrites=true&w=majority";
const mongoose=require('mongoose');
mongoose.connect(URL);

app.get('/view',(request,response)=>{
         Employee.find((err,result)=>{
           if(err) throw err;
           else
           response.render('viewemp',{emps:result});
         });
});

app.post('/check',(request,response)=>{
         Login.findOne({userid:request.body.uid,password:request.body.pwd},
           (err,result)=>{
             //console.log(result);
           if(err) throw err;
           else if(result!=null)
           {
          //  if(result.userid==request.body.uid && result.password==request.body.pwd)
           response.render('newemp');
           }
           response.render('login',{msg:"Login Fail "});
         });
       });




app.post('/EmpInsert',(request,response)=>{
     //MongoDB code
    var newEmp=new Employee({
        eid:request.body.eid,
        ename:request.body.ename,
        salary:request.body.salary
        });
//save function return promises
     newEmp.save().then(data=>{
       console.log("data inserted");
       response.render('newemp',{msg:'Data inserted...'});
     });

});






//
