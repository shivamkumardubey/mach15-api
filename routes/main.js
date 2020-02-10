const express=require("express");
const router=express.Router();
const myconection=require("./conection");
var login=require('./loginroutes');
var forget=require('./controller')

router.get("/",(req,res)=>{
   res.send("hi dubey");
})
router.get("/:id",(req,res)=>{
    if (req.params.id==1234)
    {
      res.send("its dubey id");
    }
    else
    res.send(req.params.id);
})
router.post('/register/signup',login.registerfan);
router.post('/login',login.login);
router.post('/forget',forget.forgetpassword);
router.post('/resetpassword',forget.resetpassword);


module.exports=router;