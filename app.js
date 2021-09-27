

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { result } = require("lodash");
const passport = require("passport-local");
const multer = require("multer");
const uuid = require("uuid");

const database = require("./SqlConnection");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

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

app.get("/",function(req,res){
    database.query("SELECT * FROM paintings",function(err,result){
    if(err) 
        console.log(err);
    else{
        //console.log(result);
        res.render("home",{
            paintings:result
        });
    }         
    })
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/management",function(req,res){

    database.query("SELECT * FROM paintings",function(err,result){
        if(err) 
            console.log(err);
        else{
            //console.log(result);
            res.render("management",{
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