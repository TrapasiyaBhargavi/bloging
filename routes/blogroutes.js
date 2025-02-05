const express=require("express");

const routes=express.Router();

const blogctl=require("../controller/blogcontroller");
const Blog=require("../model/blogmodel");

const passport=require("../config/passportlocal")

const {check}=require("express-validator")


routes.get("/",passport.checkAuth,blogctl.addblog);

routes.post("/insertblog",Blog.Uploadblogimage,[
    check('titlename').notEmpty().withMessage("first name is required").isLength({min:2}).withMessage("Minimum 2 Character"),
    check('categoryId').notEmpty().withMessage("category is required"),
],blogctl.insertblog);

routes.get("/viewblog",passport.checkAuth,blogctl.viewblog);

routes.get("/updateblog",passport.checkAuth,blogctl.updateblog);

routes.post("/editblog",Blog.Uploadblogimage,blogctl.editblog)

routes.get("/deleteblog",blogctl.deleteblog);

routes.post("/deletemultipleblog",blogctl.deletemultipleblog);

routes.get("/changestatustrue",blogctl.changestatustrue);

routes.get("/changestatusfalse",blogctl.changestatusfalse);

routes.get("/asecendingblog",blogctl.asecendingblog);

routes.get("/desecendingblog",blogctl.desecendingblog);

module.exports=routes;