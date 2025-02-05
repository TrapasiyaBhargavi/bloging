
const express=require("express");

const port=8001;

const app=express();

const path=require("path");

const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://bhargavitrapasiya12:OTUnLTQlfQAxcUJ2@cluster0.djlmy.mongodb.net/admindata",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then((res)=>{
    console.log("db is connected");
})
.catch((err)=>{
    console.log("db is not connected")
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const cookieparser=require("cookie-parser");
app.use(cookieparser());

const session=require("express-session");
const passport=require("passport");
const LocalStrategy=require("./config/passportlocal");

const flash=require("connect-flash");
const flashmessage=require("./config/flashconnect")

app.use(express.urlencoded());

// const db=require("./config/db");


app.use(express.static(path.join(__dirname,"assets")));

app.use("/Uploads",express.static(path.join(__dirname,"Uploads")));

app.use("/Uploads/Blogsimages",express.static(path.join(__dirname,"Uploads/Blogsimages")));
app.use("/Uploads//Uploads/commentimge",express.static(path.join(__dirname,"Uploads//Uploads/commentimge")));






app.use(session({
    name:"RNW",
    secret:"rnw",
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:1000*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthUser);
app.use(flash());
app.use(flashmessage.setflash);

app.use("/",require("./routes/adminroutes"));

app.use("/category",require("./routes/categoryroutes"));

app.use("/blogs",require("./routes/blogroutes"));

app.listen(port,(err)=>{
    if(err){
        console.log("error");
        return false;
    }
    console.log("server is run:",port);
})