const express=require('express');
const app=express();
const bodyParser=require('body-parser');

const csurf = require('csurf');
const cookieParser = require('cookie-parser');

app.listen(3000,()=>{
  console.log("Server started....");
});


//to set CSRF Token
   const csrfMiddleware = csurf({
     cookie: true
   });

   app.use(bodyParser.urlencoded({
     extended: true
   }));
   app.use(cookieParser());
   app.use(csrfMiddleware);

//congigure view engine :Hbs
var path=require('path');
app.set('views',path.join(__dirname,'views')); //location
app.set('view engine','hbs');//extension

//configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

app.get('/',(request,response)=>{
response.render('login',{csrf:request.csrfToken()});
});

const Employee=require('./model/employee');
const Login=require('./model/login');
const URL="mongodb://localhost:27017/EMSDB";
//const URL="mongodb+srv://nitin:12345@cluster0-r61ra.mongodb.net/test?retryWrites=true&w=majority";
const mongoose=require('mongoose');
mongoose.connect(URL,{ useNewUrlParser: true });


app.get('/checkExistance',(request,response)=>{

         Employee.findOne({eid:request.query.eid},(err,result)=>{
           if(err) throw err;
           else if(result!=null){
            response.send({msg:"Already Exist"});
          }else{
             response.send({msg:"Available"});
           }
         });
});

app.get('/newemp',(request,response)=>{
           response.render('newemp',{csrf:request.csrfToken()});
      });

      const EmployeeAddress=require('./model/employeeaddress');

      app.get('/view',(request,response)=>{
        EmployeeAddress.aggregate(
          [
            {
              $lookup:
                     {from:"employees",
                      localField:"eid",
                      foreignField:"eid",
                      as:"data"}
            }
          ],(err, result)=> {
          if (err) throw err;
          console.log(result);
           response.json(result);
         //response.render('viewemp',{emps:result});
          }
        );
      });
// app.get('/view',(request,response)=>{
//          Employee.find((err,result)=>{
//            if(err) throw err;
//            else
//            response.render('viewemp',{emps:result});
//          });
// });

app.get('/delete',(request,response)=>{
         Employee.deleteOne({_id:request.query.id},(err)=>{
           if(err) throw err;
           else{
             Employee.find((err,result)=>{
               if(err) throw err;
               else
               response.render('viewemp',{emps:result,msg:'Data Deleted'});
             });
           }
         });
       });


       app.get('/update',(request,response)=>{
                Employee.findOne({_id:request.query.id},(err,result)=>{
                  if(err) throw err;
                  else
                  response.render('getemp',{emp:result});
                    });
  });




app.post('/check',(request,response)=>{
         Login.findOne({userid:request.body.uid,password:request.body.pwd},
           (err,result)=>{
             //console.log(result);
           if(err) throw err;
           else if(result!=null)
           {
           response.render('newemp',{csrf:request.csrfToken()});
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
  var newEmpadd=new EmployeeAddress({
            eid:request.body.eid,
            city:'Ujjain',
            state:'MP'
            });

//save function return promises
newEmp.save().then(data=>{
  console.log("data inserted");
  newEmpadd.save().then(data=>{
    console.log("data inserted");
         });
         response.render('newemp',{msg:'Data inserted...'});
      });
});


app.post('/updateAction',(request,response)=>{
  Employee.findByIdAndUpdate(request.body.id,{eid:request.body.eid,
    ename:request.body.ename,
    salary:request.body.salary
  },(err)=>{
    if(err) throw err;
    else{
      Employee.find((err,result)=>{
        if(err) throw err;
        else
        response.render('viewemp',{emps:result,msg:'Data Updated'});
      });


    }
  });


});






//
