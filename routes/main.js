const express=require("express");
const router=express.Router();

var control=require('./controller');
var login=require('./loginroutes');



router.get("/",(req,res)=>{
    res.send("hi dubey");
})

router.post('/register/signup',login.registerfan);
router.post('/login',login.login);
router.post('/changepassword',control.changepassword);
router.post('/updateprofile',control.updateprofile);
router.get('/viewprofile',control.viewprofile);
router.post('/userproject',control.userproject)
module.exports=router;