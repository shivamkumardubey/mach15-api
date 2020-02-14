connection=require('./conection')
var crypto=require('crypto')
// for signup
exports.registerfan = function(req,res){
    // console.log("req",req.body);
    var today = new Date();
    //for pasword hasing
    var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
    var haspassword = mykey.update(req.body.password, 'utf8', 'hex')
    haspassword += mykey.final('hex');
    var users={
      "firstname":req.body.firstname,
      "lastname":req.body.lastname,
      "email":req.body.email,
      "password":haspassword,
      
    }

    connection.query('SELECT email FROM fans  WHERE email = ?',[users.email], function (error, results, fields) {
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }
    else
    {
       console.log(results)
         if(results.length==0)
        {
          connection.query('INSERT INTO fans SET ?',users, function (error, results, ) {
            if (error) {
           console.log("error ocurred",error);

           res.send({
          "code":400,
          "failed":"error ocurred",
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
            "existinfo":true
          })
        }
    }
   

    });
  }

 
// for login
  exports.login = function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    connection.query('SELECT * FROM fans  WHERE email = ?',[email], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      // console.log('The solution is: ', results);
      if(results.length >0){
       //for dehasing the password
       var crypto = require('crypto');

       var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
       var dehaspassword = mykey.update(results[0].password, 'hex', 'utf8')
       dehaspassword += mykey.final('utf8');

        if(dehaspassword == password){
          console.log(results);
          fullname=results[0].firstname+" "+results[0].lastname
          emailid=results[0].email
          console.log(fullname)
          var token = crypto.randomBytes(10).toString('hex');
          connection.query('UPDATE fans SET usertoken=? WHERE email=?',[token,emailid],function(error,results){
            if(error){console.log(error)}
            else{}
          })
          res.send({
            "code":200,
            "success":"login sucessfull",
            "status":true,
            "message":fullname,
            "token":token,
            "emailid":email
              });
        }
        else{
          res.send({
            "code":204,
            "success":"Email and password does not match",
            "status1":true
              });
        }
      }
      else{
        console.log(results);
        res.send({
          
          "code":204,
          "success":"Email does not exits",
            "status2":true
            });
      }
    }
    });
  }