require('dotenv').config();
var mysql=require('mysql');
var mysqlConnection=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASS,
    database:process.env.MYSQL_DB,
    multipleStatements:true
});

mysqlConnection.connect((err)=>{
    if (err) throw err;
   else console.log('Connected!');
   
})
module.exports=mysqlConnection;
