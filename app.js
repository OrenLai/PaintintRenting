

const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const { result } = require("lodash");
const multer = require("multer");
const uuid = require("uuid");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy  = require('passport-local').Strategy;
const bcrypt = require("bcrypt");

const database = require("./SqlConnection");



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

// for session and authentication with MySQL
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	database.query("SELECT * from users where id = "+id,function(err,rows){	
		done(err, rows[0]);
	});
});

//Routes

app.get("/",function(req,res){
    database.query("SELECT * FROM paintings",function(err,result){
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

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",
  passport.authenticate("local"),
  function(req,res){
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect("/");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        database.query("INSERT INTO ")
    } catch {

    }
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