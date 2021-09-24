require("dotenv").config();

const mysql = require("mysql2");

const con = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,

    database: process.env.DB_NAME
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
        //const sql = "INSERT INTO paintings (name,description,price,imgsrc) VALUES('paint4','watercolor',999,'/images/arts/p4.jpg')";
 
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
        //     ['paint1', 'watercolor',111],
        //     ['paint2', 'aqulics',222],
        //     ['paint3', 'pancils',333],            
        // ];
        // con.query(sql,[values],function(err,result){
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log("multiple records inserted into the table :",result.affectedRows);
        //     }
        // });

        // different ways to SELECT  from the table
        //const sql = "SELECT * FROM paintings ORDER by price DESC"; sorted by price ,desc order
        //escape the query from user , use mysql.escape()
        // const des = "watercolor";
        // const prc = "777";
        // const sql = "SELECT * FROM paintings WHERE description = ? AND price = ?";
        
        // select all result with price starts with 7 like 777 or 766 or 7xxxx
        //const sql = "SELECT * FROM paintings WHERE price LIKE '7%'" 

        // const delete_sql = "DELETE from paintings WHERE id ='18'";

        //const sql = "ALTER TABLE paintings ADD imgsrc VARCHAR(255)"; 
        // add a new column imgsrc into the table
        
        //const sql = "UPDATE paintings SET name ='Wind and Dirt' WHERE name = 'paint3'"

        // con.query(delete_sql, function(err, result){
        //     if(err) 
        //         console.log(err);
        //     else 
        //         //console.log(fields); the fields object is an array containing information about each field as an object
        //         console.log(result);
        // })
    }
});

module.exports = con;
