const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt");

function initialize(passport,getUserByEmail,getUserById){
    const authenticateUser = (email, password, done) => {
        console.log("hello1");
        getUserByEmail(email, (err, user) => {
            console.log("hello2");
            if (err) {
                return done(null,false, {message:err})
            }
            if(user == null){
                return done(null,false, {message:"no user with this email"})        
            }
            console.log("authenticate user:" + user); 
    
            bcrypt.compare(password,user.password,(err,result)=>{
                if (err)
                    console.log(err);
                else {
                    if (result){
                        return done(null,user)
                    } else {
                        return done(null,false,{ message: "password incorrect." })
                    }
                }
            })
        })
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done)=>done(null,user.id))
    passport.deserializeUser((id, done)=> {
        console.log("user_id: " + id)
        getUserById(id,(err,user)=>{
            if(err){
                return done(null, false, {message:err})
            }
            if(user == null){
                return done(null, false, {message:"no user with this id"})
            }
            return done(null, user)
        })
    })
    
};

module.exports = initialize