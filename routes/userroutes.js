const express=require("express");

const routes=express.Router();

const userctl=require("../controller/usercontroller");

const comment=require("../model/commentmodel")

const passport=require("../config/passportlocal")

routes.get("/",userctl.home);

routes.get("/readmore/:id",userctl.readmore);

routes.post("/addcomment",comment.Uploadcomentimage,userctl.addcomment)

routes.get("/commentview",userctl.commentview)

routes.get("/changestatustrue",userctl.changestatustrue);

routes.get("/changestatusfalse",userctl.changestatusfalse);

routes.get("/userregister",userctl.userregister);

routes.post("/userregisterdata",userctl.userregisterdata);

routes.get("/userlogin",userctl.userlogin);

routes.post("/userrlogindata",passport.authenticate("userAuth",{failureRedirect:"/"}),userctl.userrlogindata);

routes.get("/setuserlike/:commentId",userctl.setuserlike);

routes.get("/setuserdislike/:commentId",userctl.setuserdislike);

routes.get("/userlogout",userctl.userlogout);

module.exports=routes;