const LocalStrategy  = require("passport-local").Strategy;

const database = require("./SqlConnection");	

//expose this function to our app using module.exports

module.exports = function(passport){

    //passport session setup
    //require for persistent login sessions
    //passport needs ability to serialize and unserialize users out of session

    passport.serializeUser(function (user,done){
        done(null,user.id);
    })

}