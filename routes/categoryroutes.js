const express=require("express");

const routes=express.Router();

const categoryctl=require("../controller/categorycontrolller");

const passport=require("../config/passportlocal")


const {check}=require("express-validator")


routes.get("/",passport.checkAuth,categoryctl.addcategory);

routes.post("/insertcategory",[
    check('categoryname').notEmpty().withMessage("Category name is required").isLength({min:2}).withMessage("Minimum 2 Character"),
],categoryctl.insertcategory);

routes.get("/viewcategory",passport.checkAuth,categoryctl.viewcategory);

routes.post("/deletemultiple",categoryctl.deletemultiple);

routes.get("/changetrue",categoryctl.changetrue);

routes.get("/changefalse",categoryctl.changefalse);

routes.get("/asecending",categoryctl.asecending);

routes.get("/desecending",categoryctl.desecending);

module.exports=routes;