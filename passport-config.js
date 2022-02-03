const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt");

function initialize(passport,getUserByEmail,getUserById){
    
    const authenticateUser = async (email, password, done)=>{
        
        const user = await getUserByEmail(email)
        
        console.log("authenticate user:" + user);        

        if(user == null){
            return done(null,false, {message:"no user with this email"})        
        }

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
    
    }
    
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done)=>done(null,user.id))
    passport.deserializeUser(async (id, done)=> done(null, await getUserById(id)))
}

module.exports = initialize