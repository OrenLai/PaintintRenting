const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const { result, values } = require("lodash");
const multer = require("multer");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const database = require("./SqlConnection");
const { query } = require("./SqlConnection");
const { data } = require("jquery");
const e = require("express");
const passport = require("passport");
const flash = require("express-flash")
const session = require("express-session");

function getUserByEmail(email){
    
    database.query("SELECT * from customers where email = ?",email,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            let row = JSON.parse(JSON.stringify(result[0]));
            console.log(row.username + " found by email");
            return row;
        }
    })
}

function getUserById(id){
    
    database.query("SELECT * from customers where id = ?",id,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            let row = JSON.parse(JSON.stringify(result[0]));
            console.log("User "+ row.username + " found by id");
            return row;
        }
    })
}

const initializePassport = require("./passport-config")
initializePassport(passport,getUserByEmail,getUserById)



const app = express();
//allow us to access the req.body.username/password...etc
app.use(express.urlencoded({extended: false}));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './public/images/arts');        
    },
    filename:function(req,file,cb){
        //descructure from the file to get the oirginal file name
        const {originalname} = file;
        //replace(/\s/g, ""); for taking the space out from the filename
        cb(null,originalname.replace(/\s/g, ""));
    }
})

// use multer to process the file upload , it will create a folder if the dest specified here doesn't exist 
//const upload = multer({dest:'./public/images/'}) 
const upload = multer({storage});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(flash());
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())

//Routes

app.get("/",function(req,res){
    database.query("SELECT * FROM paintings",(err,result)=>{
    if(err) 
        console.log(err);
    else{
        //console.log(result);
        res.render("home",{
            paintings:result
            // loggedIn : true,
            // userid:0
        });
    }         
    })
});

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login", passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true
}))


// app.post("/login",(req,res)=>{

//     let email = req.body.email
//     let password = req.body.password
//     let hash;
//     // get the hashed password according to the email
//     database.query("SELECT * FROM customers WHERE email = ?", [email] ,(err,result)=>{
//         if(err){
//             console.log(err);
//         }else{
//             let row = JSON.parse(JSON.stringify(result[0]));
//             console.log(row.password);
//             hash = row.password;
//         }        
//     })

//     bcrypt.compare(password, hash, function(err, result) {
//         if (result == true){
//             console.log("match");
//             res.redirect("/");
//         }else{
//             console.log("do not match");
//             res.redirect("/login");
//         }
//     });

// })

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
        
    // check_query = "SELECT EXISTS(SELECT * from customers WHERE email='" + email +"')";
    // //check_query = "SELECT * from customers where email='" + email + "'";
    // database.query(check_query,(err,result)=>{
    //     console.log(result);
    // })

    bcrypt.hash(req.body.password,10,function(err,hash){

        if (err){
            console.log(err);
        }else{
            let hashedPassword = hash
            console.log(hashedPassword);
            let sql="INSERT INTO customers (username,email,password) VALUES(?,?,?)";    
            val = [req.body.username, req.body.email,hashedPassword]
            database.query(sql,val,function(err,result){
                if(err){
                    console.log(err);
                }else{
                    console.log("user "+ req.body.username + " is registered successfully.");
                }
            });    
        }
    });

    res.redirect("/")
})

app.get("/add",function(req,res){

    database.query("SELECT * FROM paintings",function(err,result){
        if(err) 
            console.log(err);
        else{
            //console.log(result);
            res.render("add",{
                paintings:result
            });
        }         
        })
});

app.get("/delete",function(req,res){
    database.query("SELECT * FROM paintings",function(err,result){
    if(err) 
        console.log(err);
    else{
        //console.log(result);
        res.render("delete",{
            paintings:result
        });
    }         
    })
});

app.get("/shoppingcart",function(req,res){
    res.render("shoppingcart");
});

app.post('/upload', upload.single('paintingImage'), function (req, res) {
    
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    console.log("file" + req.file.originalname.replace(/\s/g, "") +" uploaded");
    
    //console.log(req.file, req.body.name)
    
    //INSERT 1 record
    const addone_sql = "INSERT INTO paintings (name,description,price,imgsrc) VALUES (?,?,?,?);";
    
    let newPaintName = req.body.name
    let newDescription = req.body.description;
    let newPrice = req.body.Price;
    let newImageSrc = "/images/arts/"+ req.file.originalname.replace(/\s/g, "");

    //console.log(newImageSrc);

    //console.log(addone_sql);
    //const sql = "INSERT INTO paintings (name,description,price,imgsrc) VALUES('paint4','watercolor',999,'/images/arts/p4.jpg')";
    database.query(addone_sql,[newPaintName,newDescription,newPrice,newImageSrc],function(err,result){
        if(err){
            console.log(err);
        }else {
            console.log("1 record inserted !");
        };
    })

    res.redirect("/");
 });

app.post('/delete',function(req,res){
    
    console.log("going to delete painting with id :" + req.body.checkbox);
    
    delete_query = "DELETE from paintings WHERE id = " + req.body.checkbox;
    
    database.query(delete_query, function(err,result){
        if (err)
            console.log(err);
        else {
            console.log("paint with id " + req.body.checkbox + " removed");
        }
    })

    res.redirect("/delete");
});



app.listen(3000,function(){
    console.log("server is up and running at port 3000");
})