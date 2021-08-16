require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mysql = require("mysql2");

const app = express();

const con = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: DB_NAME
});

con.connect(function(err){
    if (err){
        console.log(err);
    }else{
        console.log("MYSQL connected !");
        //create Database
        // con.query("CREATE DATABASE OrenDB", function (err, result) {
        //     if (err) throw err;
        //     console.log("Database created");
        //   });
        

        //create TABLE names paintings
        // const sql1 = "CREATE TABLE paintings(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255) ,description VARCHAR(255) , price INT)";
        // con.query(sql1,function(err,result){
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log("new table created");
        //     }

        // })
        
        // INSERT 1 record
        // const sql = "INSERT INTO paintings (name,description,price) VALUES('paint1','watercolor',999)";
 
        // con.query(sql,function(err,result){
        //     if(err){
        //         console.log(err);
        //     }else {
        //         console.log("1 record inserted !");
        //     };
        // })


        //INSERT multiple records
        // const sql = "INSERT INTO paintings (name,description,price) VALUES ?"
        
        // const values = [
        //     ['paint2', 'watercolor',888],
        //     ['paint3', 'watercolor',777],
        //     ['paint4', 'watercolor',666],
        //     ['paint5', 'aqulics',555],
        //     ['paint6', 'aqulics',444],
        //     ['paint7', 'aqulics',333],
        // ];
        // con.query(sql,[values],function(err,result){
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log("multiple records inserted into the table :",result.affectedRows);
        //     }
        // });
    }
})

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/favorites",function(req,res){
    res.render("favorites");
});

app.get("/shoppingcart",function(req,res){
    res.render("shoppingcart");
});


app.listen(3000,function(){
    console.log("server is up and running at port 3000");
})