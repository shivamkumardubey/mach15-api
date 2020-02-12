var nodemailer = require('nodemailer');
require('dotenv').config();
crypto=require('crypto')
connection=require('./conection')
var async = require("async");
// for forget password
exports.forgetpassword=function (req,res) {
   var email=req.body.email;
   connection.query('SELECT * FROM fans  WHERE email = ?',[email],function (error,results) {
       if(error){
             res.send({
             "code":400,
               "failed":"error ocurred"
             })
       }
       else{
          if(results.length ==0){
            
              res.send({
                  "existinfo":true,
                  "existmessage":"no such account exist enter a valid user"
              })
          }
          else{
            var token = crypto.randomBytes(3).toString('hex');
            connection.query('UPDATE fans SET recoveryotp=? WHERE email=?',[token,email] ,function(error,results){
              if(error){
                console.log(error)
              }
              else{
                console.log("token in database is update")
                res.send({
                  "sendstatus":true,
                  "statusmessage":"resetpassword code is send to"+req.body.email,
                  "redirectstatus":true
              })
              }
            })

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.Gmail,
                  pass: process.env.GMAILPW
                }
              });
              
              var mailOptions = {
                from: process.env.Gmail,
                to:req.body.email,
                subject: 'for password reset of bandbazaar',
                html: 'hey!'+results[0].firstname+" "+results[0].lastname+  "  enter the code below for reset your password - "+'<b>'+token+'</b>',
              
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                 
                }
              });
             
          }
       }
       
   })
    
}
//for reset password

exports.resetpassword=function (req,res) {
  var email=req.body.email;
  var otp=req.body.otp;
  var password=req.body.password;
  connection.query('SELECT * FROM fans  WHERE email = ?',[email],function(error,results){
        if(error){
          res.send({
            "code":400,
              "message":"error ocurred"
            })

        }
        else{
            if(results.length==0)
            {
              res.send({
                "message":'something is wrong'
              })
            }
            else{
              // for update the otp
              if(results[0].recoveryotp==otp){
                connection.query('UPDATE fans SET password=? WHERE email=?',[password,email],function(error,results){
                  if(error){
                    console.log(error)
                  }
                  else{
                    console.log("update")
                    res.send({
                      'passwordupdated':true,
                      'message':'password update sucessfully'
                    })
                  }

                })
              }
              else{
                console.log("otp not match")
                res.send({
                  "message":"otp does not match"
                })
              }
            }
        }
  })
  
}
// for email verification
