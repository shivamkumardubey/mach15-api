require('dotenv').config();
crypto=require('crypto');
module.exports={
    checktoken:function(req,res){
        const token = req.headers.token;
        var crypto = require('crypto');
     try{
        var mykey = crypto.createDecipher('aes-128-cbc', 'mach15-project');
        var email = mykey.update(token, 'hex', 'utf8')
        email += mykey.final('utf8');
        return email;
     }
     catch(err)
     {
    //    console.log(err);
      return false
    }
     

    }
}