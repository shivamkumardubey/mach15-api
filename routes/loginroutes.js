connection=require('./conection')
var crypto=require('crypto')
// for signup
exports.registerfan = function(req,res){
    // console.log("req",req.body);
    var today = new Date();
    //for pasword hasing
    var mykey = crypto.createCipher('aes-128-cbc', 'bandbazaar');
    var haspassword = mykey.update(req.body.password, 'utf8', 'hex')
    haspassword += mykey.final('hex');
    var users={
      "fullname":req.body.fullname,"email":req.body.email,"phone":req.body.phone,"password":haspassword,
    }

    connection.query('SELECT email FROM users  WHERE email = ?',[users.email], function (error, results, fields) {
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "errorMessage":"error ocurred"
        })
      }
    else
    {
       console.log(results)
         if(results.length==0)
        {
          connection.query('INSERT INTO users SET ?',users, function (error, results, ) {
            if (error) {
           console.log("error ocurred",error);

           res.send({
          "code":400,
          "errorMessage":"error ocurred",
          "status":false
          })
         }
         else
         {
           console.log('The solution is: ', results);
      
           res.send({
            "code":200,
           "success":"user registered sucessfully",
           "status":true,
           "result":results
            }); 
          }

         });  
        }

        else
        {
          res.send({
           "existinfo":true,
            "errorMessage":"user already exist"
          })
        }
    }
   

    });
  }

 
// for login
  exports.login = function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    connection.query('SELECT * FROM users  WHERE email = ?',[email], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "code":400,
        "errorMessage":"error ocurred"
      })
    }else{
      // console.log('The solution is: ', results);
      if(results.length >0){
       //for dehasing the password
       var crypto = require('crypto');
       var mykey = crypto.createDecipher('aes-128-cbc', 'bandbazaar');
       var dehaspassword = mykey.update(results[0].password, 'hex', 'utf8')
       dehaspassword += mykey.final('utf8');
      // 
        if(dehaspassword == password){
          console.log(results);
          fullname=results[0].fullname;
          emailid=results[0].email
          //  var a=results[0].id.toString();
          //  console.log(a);
          
          // user token
          var mykey = crypto.createCipher('aes-128-cbc', 'mach15-project');
          var token = mykey.update(results[0].email, 'utf8', 'hex')
          token += mykey.final('hex');
        // 


          
          res.send({
            "code":200,
            "status":true,
            "username":fullname,
            "token":token,
            "email":email,
            "phone":results[0].phone,

              });
        }
        else{
          res.send({
            "code":204,
            "errorMessage":"Email and password does not match",
            
              });
        }
      }
      else{
        console.log(results);
        res.send({
          
          "code":204,
          "errorMessage":"Email does not exits",
            
            });
      }
    }
    });
  }