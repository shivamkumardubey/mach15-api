var nodemailer = require('nodemailer');
require('dotenv').config();
crypto=require('crypto')
connection=require('./conection')
var async = require("async");
const valFuncation=require('./validator')
// for forget password

// for changepassword
exports.changepassword=function(req,res){
       var email=  valFuncation.checktoken(req,res);
       if(email){
        var mykey = crypto.createCipher('aes-128-cbc', 'bandbazaar');
        var haspassword = mykey.update(req.body.password, 'utf8', 'hex')
         haspassword += mykey.final('hex');


        connection.query('UPDATE users SET password=? WHERE email=?',[haspassword,email] ,function(error,results){
          if(error){
            console.log(error)
          }
          else{
            console.log("in database is update")
            res.send({
              "status":true,
              "statusmessage":"password is updated successfully",
             
          })
          }
        })
       }
       else{
       console.log("hey bro")
         res.send({
          "status":false 
         })
       }
}
// for updateuser profile
exports.updateprofile=function(req,res){
  var email=  valFuncation.checktoken(req,res);
  if(email){
   var fullname=req.body.fullname;var phone=req.body.phone;var college=req.body.college;var department=req.body.department;var degree=req.body.degree;var address=req.body.address;var joiningyear=req.body.joiningyear;

   connection.query('UPDATE users SET fullname=?,phone=?,college=?,department=?,degree=?,address=?,joiningyear=? WHERE email=?',[fullname,phone,college,department,degree,address,joiningyear,email] ,function(error,results){
     if(error){
       console.log(error)
     }
     else{
       console.log("in database is update")
       connection.query('SELECT * FROM users  WHERE email = ?',[email], function (error, results, fields){
         if(error){
           console.log(error)
         }
         else{
          res.send({
            "status":true,
            "fullname":results[0].fullname,
            "email":results[0].email,
            "phone":results[0].phone,
            "college":results[0].college,
            "department":results[0].department,
            "degree":results[0].degree,
            "address":results[0].address,
            "joiningyear":results[0].joiningyear,
           
        })
         }
       });

      console.log(results)
     
     }
   })
  }
  else{
  console.log("hey bro")
    res.send({
     "status":false 
    })
  }
}

// for view profile
exports.viewprofile=function(req,res){
  var email=  valFuncation.checktoken(req,res);
  if(email){
   

   connection.query('SELECT * FROM users  WHERE email = ?',[email],function(error,results){
     if(error){
       console.log(error)
     }
     else{
       console.log("view profile is send")
      

          res.send({
            "status":true,
            "fullname":results[0].fullname,
            "email":results[0].email,
            "phone":results[0].phone,
            "college":results[0].college,
            "department":results[0].department,
            "degree":results[0].degree,
            "address":results[0].address,
            "joiningyear":results[0].joiningyear, 
       });

   
     
     }
   })
  }
  else{
  console.log("hey bro")
    res.send({
     "status":false 
    })
  }
}
// for project joining 
exports.userproject= async function(req,res){
 
 res.send(
   {
     "status":true
   }
 )
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Gmail,
      pass: process.env.GMAILPW
    }
  });
  
  var mailOptions = {
    from: process.env.Gmail,
    to:'',
    subject: 'for project deal',
    html: '<p>'+'name-'+'<b>'+req.body.fullname+'</b>'+'<br>'+  'email-'+'<b>'+req.body.email+'</b>'+'<br>'+'phone-'+'<b>'+req.body.phone+'</b>'+'<br>'+'address-'+'<b>'+req.body.address+'</b>'+'<br>'+'role-'+'<b>'+req.body.role+'</b>'+'<br>'+'project-'+'<b>'+"homeautonomation"+'</b>'+'<br>'+'</p>',
   
   

  };
  var mailOptions1={
    
    from: process.env.Gmail,
    to:req.body.email,
    subject: 'for project deal',
    html: 'hey!'+'<b>'+req.body.fullname+'</b>'+" "+  "  thanks for joining mach15project our technical supports team will be contact you shortly have a nice day - ",
  }
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.send({
        "status":false
      })
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      return true;
     
    }
  });

    transporter.sendMail(mailOptions1, function(error, info){
      if (error) {
       
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        
       
      }
    });

  
}