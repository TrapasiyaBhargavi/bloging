const express=require("express");

const routes=express.Router();

const Admin=require("../model/adminmodel");

const adminctl=require("../controller/admincontroller");

const passport=require("../config/passportlocal");

const {check}=require("express-validator")

//login start

routes.get("/signin",adminctl.signin);

routes.post("/checksignin",passport.authenticate("local",{failureRedirect:"/signin"}),adminctl.checksignin);

routes.get("/signout",adminctl.signout);

routes.get("/myprofile",passport.checkAuth,adminctl.myprofile);

routes.get("/changepassword",passport.checkAuth,adminctl.changepassword);

routes.post("/changenewpassword",adminctl.changenewpassword)

routes.get("/checkemail",adminctl.checkemail);

routes.post("/verifyemail",adminctl.verifyemail);

routes.get("/checkotp",adminctl.checkotp);

routes.post("/verifyotp",adminctl.verifyotp);

routes.get("/forgetpass",adminctl.forgetpass);

routes.post("/verifypass",adminctl.verifypass);

//login end





routes.get("/Dashboard",passport.checkAuth,adminctl.Dashboard);

routes.get("/addadmin",passport.checkAuth,adminctl.addadmin);

routes.post("/insertadmin",Admin.Uploadimage,[
            check('fname').notEmpty().withMessage("first name is required").isLength({min:2}).withMessage("Minimum 2 Character"),
            check('lname').notEmpty().withMessage("last name is required").isLength({min:2}).withMessage("Minimum 2 Character"),
            check('email').notEmpty().withMessage("email is required").isEmail().withMessage("email is invalid").custom(async (value)=>{
                let checkemail=await Admin.find({email:value}).countDocuments();
                if(checkemail>0){
                    throw new Error("Admin email is exit")
                }
            }),
            check('password','...').notEmpty().withMessage("password is required").matches( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).withMessage("one lowercase one uppercase minimum 8 character"),
            check('gender').notEmpty().withMessage("Gender is required"),
            check('hobby').notEmpty().withMessage("Hobby is required"),
            check('city').notEmpty().withMessage("city is required")
],adminctl.insertadmin);

routes.get("/viewadmin",passport.checkAuth,adminctl.viewadmin);

routes.get("/deleteadmin/:id",adminctl.deleteadmin);

routes.get("/updateadmin",adminctl.updateadmin);

routes.post("/editadmin",Admin.Uploadimage,adminctl.editadmin);

routes.use("/",require("./userroutes"));

routes.post("/deletemultipleadmin",adminctl.deletemultipleadmin);

module.exports=routes;