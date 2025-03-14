const passport=require("passport");

const LocalStrategy=require("passport-local").Strategy;

const adminmodel=require("../model/adminmodel");;

const User=require("../model/usermodel")

passport.use(new LocalStrategy({
    usernameField:'email'
},async function(email,password,done){
    
    let admindata=await adminmodel.findOne({email:email});

    if(admindata){
        if(admindata.password==password){
                return done(null,admindata)
        }
        else{
            return done(null,false)
        }
    }
    else{
        return done(null,false)
    }
}))

// user

passport.use("userAuth",new LocalStrategy({
    usernameField:'email'
},async function(email,password,done){
    console.log("middleware");
    console.log(email,password);
    let admindata=await User.findOne({email:email});

    if(admindata){
        if(admindata.password==password){
                return done(null,admindata)
        }
        else{
            return done(null,false)
        }
    }
    else{
        return done(null,false)
    }
}))

passport.serializeUser(function(user,done){
    return done(null,user.id)
})

passport.deserializeUser(async function(id,done){
    let adminRecord=await adminmodel.findById(id);
    if(adminRecord){
        return done(null,adminRecord)
    }
    else{
        const userrecord=await User.findById(id);
        if(userrecord){
            return done(null,userrecord)
        }
        else{
            return done(null,false);
        }
        }
       
})


passport.setAuthUser=function(req,res,next){
        if(req.isAuthenticated()){
            res.locals.user=req.user
        }
        next();
}

passport.checkAuth=function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect("/signin")
    }
}



module.exports=passport;