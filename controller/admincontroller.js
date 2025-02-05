const Admin=require("../model/adminmodel");
const fs=require("fs");
const path=require("path");
const nodemailer = require("nodemailer");
const category=require("../model/categorymodel");
const Blog=require("../model/blogmodel");
const Comment=require("../model/commentmodel");

const {validationResult}=require("express-validator");





module.exports.Dashboard=async(req,res)=>{
    // console.log(req.cookies.admindata);
   
let categorytotal=await category.find();
let blogtotal=await Blog.find().populate('categoryId').exec();
let commenttotal=await Comment.find().populate('PostId').exec()
let total=blogtotal.length;
let cattotal=categorytotal.length;


let categorychart=[];

categorytotal.map((v,i )=>{ 
    categorychart.push(v.categoryname)
});

let categorycharteB = categorytotal.map((v) => 
    blogtotal.filter((b) =>
         b.categoryId.equals(v._id)).length);


let categorycharteB2 = categorytotal.map((v) => 
    commenttotal.filter((b) =>
         b.PostId && b.PostId.categoryId.equals(v._id)).length);

        return res.render("Dashboard",{
            total,
            categorychart,
            cattotal,
            categorycharteB,
            categorycharteB2
           
         
        })
          
      
   

   
}

module.exports.addadmin=async(req,res)=>{
   
        return res.render("addadmin",{
            errordata:[],
            olddata:[]
        })
           
    
    
}

module.exports.insertadmin=async(req,res)=>{
    try{
      
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.render("addadmin", {
                errordata: errors.mapped(),  // Pass validation errors
                olddata: req.body           // Keep old data to refill form
            });
        }
       
          let imagespath='';
        if(req.file){
            imagespath=await Admin.imgpath+"/"+req.file.filename;
        }
        req.body.image=imagespath;
        req.body.name=req.body.fname+" "+req.body.lname;
        let admindata=await Admin.create(req.body);
        if(admindata){

            req.flash("success","data sucefully add");
            // console.log("data sucefully add");
            return res.redirect("/viewadmin");
        }
        else{
            req.flash("success","data not found");
            // console.log("data not found");
            return res.redirect("back");
        }
       
    
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back");
    }
}

// const { validationResult } = require("express-validator");

// module.exports.insertadmin = async (req, res) => {
//     try {
//         const errors = validationResult(req);
        
//         if (!errors.isEmpty()) {
//             return res.render("addadmin", {
//                 errordata: errors.mapped(),  // Pass validation errors
//                 olddata: req.body           // Keep old data to refill form
//             });
//         }

//         let imagePath = "";
//         if (req.file) {
//             imagePath = Admin.imgpath + "/" + req.file.filename;
//         }
//         req.body.image = imagePath;
//         req.body.name = req.body.fname + " " + req.body.lname;

//         let adminData = await Admin.create(req.body);
//         if (adminData) {
//             req.flash("success", "Data successfully added");
//             return res.redirect("/viewadmin");
//         } else {
//             req.flash("error", "Data not found");
//             return res.redirect("back");
//         }

//     } catch (err) {
//         console.log("Something is wrong:", err);
//         req.flash("error", "Internal Server Error");
//         return res.redirect("back");
//     }
// };


module.exports.viewadmin=async(req,res)=>{
    try{
     
            let viewdata=await Admin.find();
              return res.render("viewadmin",{
              
            viewdata});
      
    
       
       
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back");
    }
}

module.exports.deleteadmin=async(req,res)=>{
    try{
       id=req.params.id;
       let getdata=await Admin.findById(id);
       if(getdata){
        try{
            deleteimg=path.join(__dirname,"..",getdata.image);
            fs.unlinkSync(deleteimg);
        }
        catch{
            console.log("image not found")
            return res.redirect("back");
        }
        let deletepath=await Admin.findByIdAndDelete(id);
        if(deletepath){  

            req.flash("success","data delete");
            // console.log("data delete")
            return res.redirect("back")
        }
        else{
            req.flash("success","data not delete");
        //  console.log("data not delete")
         return res.redirect("back")
        }
       }
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back");
    }
}

module.exports.updateadmin=async(req,res)=>{
    try{
        id=req.query.adminid;
        let singleadmin=await Admin.findById(id);
        if(singleadmin){
            return res.render("updateadmin",{
                singleadmin
            })
        }
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back");
    }
}

module.exports.editadmin=async(req,res)=>{
    try{
        if(req.file){
            let singledata=await Admin.findById(req.body.aid);
            try{
                let oldimage=path.join(__dirname,"..",singledata.image);
                fs.unlinkSync(oldimage);
            }
            catch{
                console.log("image not found");
            }
            let newimg=await Admin.imgpath+"/"+req.file.filename;
            req.body.image=newimg
            req.body.name=req.body.fname+""+req.body.lname;
            let updatedata=await Admin.findByIdAndUpdate(req.body.aid,req.body);
            if(updatedata){
                req.flash("success","data update sucefully");
                // console.log("data update sucefully");
                return res.redirect("viewadmin")
             }
             else{
                req.flash("success","data not update");
                // console.log("data not update");
                return res.redirect("back");
             }

        }
        else{
            let singledata=await Admin.findById(req.body.aid);
            req.body.image=singledata.image;
            let updatedata=await Admin.findByIdAndUpdate(req.body.aid,req.body);
            if(updatedata){
                req.flash("success","data update sucefully");
                // console.log("data update sucefully");
                return res.redirect("viewadmin")
             }
             else{
                req.flash("success","data not update");
                // console.log("data not update");
                return res.redirect("back");
             }
        }

    }
   catch{
    console.log("somthing is wrong");
    return res.redirect("back");
    }
}

module.exports.signin=async(req,res)=>{
    try{
        return res.render("signin");
    }
    catch{
        console.log("somthing is wrong");
    return res.redirect("back");
    }
}

module.exports.checksignin=async(req,res)=>{
    try{
      
    req.flash("success","admin sigining succefully");
    return res.redirect("/Dashboard");
           

    }
    catch{
        req.flash("success","somthing is wrong");
        // console.log("somthing is wrong");
        return res.redirect("back");
    }
}

module.exports.signout=async(req,res)=>{
    req.session.destroy(function(err){
        if(err){
            return false
        }
        else{
            // req.flash("success","signout succsefully");
            return res.redirect("/");
        }
    })

}

module.exports.myprofile=async(req,res)=>{
    try{
        return res.render("myprofile")
           
       
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back");
    }
}

module.exports.changepassword=async(req,res)=>{
    try{
        return res.render("changepassword");
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back")
    }
}

module.exports.changenewpassword=async(req,res)=>{
    try{
         let olddata=req.user
         if(olddata.password==req.body.currentpassword){
            if(req.body.currentpassword!=req.body.newpassword){
                if(req.body.newpassword==req.body.confirmpassword){
                    let editpassword=await Admin.findByIdAndUpdate(olddata._id,{password:req.body.newpassword});
                        return res.redirect("/signout");
                }
                else{
                    req.flash("success","new and confirm password are not match");
                    // console.log("new and confirm password are not match")
                }

            }
            else{
                req.flash("success","current and new password are match!try again");
                // console.log("current and new password are match!try again")
            }

         }
         else{
            req.flash("success","current password not match");
            // console.log("current password not match");

         }
    }
    catch{
        console.log("somthing wrong");
        return res.redirect("back")
    }
}

module.exports.checkemail=async(req,res)=>{
    try{
        return res.render("checkemail");
    }
    catch{
        console.log("somthing wrong");
        return res.redirect("back")
    }
}

module.exports.verifyemail=async(req,res)=>{
    try{
        console.log(req.body);
         
         let singleobj=await Admin.find({email:req.body.email}).countDocuments();
         if(singleobj==1){
         let singleadmindata=await Admin.findOne({email:req.body.email})
         
         let OTP=Math.floor(Math.random()*100000)
         console.log(OTP)
         res.cookie('otp',OTP);
         res.cookie('email',singleadmindata.email);

         const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "bhargavitrapasiya12@gmail.com",
              pass: "lybrupwzswegwzjy",
            },
            tls:{
                 rejectUnauthorized:false
            }
          });

          const info = await transporter.sendMail({
            from: "bhargavitrapasiya12@gmail.com", // sender address
            to:"bhargavitrapasiya12@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>your OTP: ${OTP}</b>`, // html body
          });
          console.log("Message sent: ")

         }
         else{
            req.flash("success","invalid email");
            // console.log("invalid email");
            return res.redirect("back")
         }

         return res.redirect("/checkotp");
        
       
    }
    catch{
        console.log("somthing wronggg");
        return res.redirect("back")
    }
}

module.exports.checkotp=async(req,res)=>{
    try{
        return res.render("checkotp");
    }
    catch{
        console.log("somthing wrong");
        return res.redirect("back")
    }
}

module.exports.verifyotp=async(req,res)=>{
    try{
        if(req.body.otp==req.cookies.otp){
            res.clearCookie("otp");
            return res.redirect("/forgetpass");
        }
        else{
            req.flash("success","Invalid otp");
            // console.log("Invalid otp");
            return res.redirect("back")
        }
    }
    catch{
        console.log("somthing wrong");
        return res.redirect("back")
    }
}

module.exports.forgetpass=async(req,res)=>{
    try{
        return res.render("forgetpass")

    }
    catch{
        console.log("somthing wrong");
        return res.redirect("back")
    }
}

module.exports.verifypass=async(req,res)=>{
    try{
        if(req.body.newpassword==req.body.confirmpassword){
            let checklastime=await Admin.find({email:req.cookies.email}).countDocuments();
            if(checklastime==1){
                let admindatanew=await Admin.findOne({email:req.cookies.email});
                let updatepass=await Admin.findByIdAndUpdate(admindatanew.id,{password:req.body.newpassword});
                if(updatepass){
                    res.clearCookie("email");
                    return res.redirect("/");
                }
                else{
                    req.flash("success","somthing is wrong");
                    console.log("somthing is wrong");
                    return res.redirect("back")
                }
            }
            else{
                req.flash("success","Invalid email");
                // console.log("invalid email");
                return res.redirect("back")
            }

        }
        else{
            req.flash("success","new and confirm are not match!try again");
            // console.log("new and confirm are not match!try again");
            return res.redirect("back")
        }
    }
    catch{
        console.log("somthing wrong");
        return res.redirect("back")
    }
}
module.exports.deletemultipleadmin=async(req,res)=>{
    try{
        let deleteadmin=await Admin.deleteMany({_id:{$in:req.body.adminId}});
        if(deleteadmin){
            req.flash("success","delete data");
            // console.log("delete data")
            return res.redirect("back");
        }
        else{
            req.flash("success","data not delete");
            // console.log("data not delete");
            return res.redirect("back");
        }
    }
    catch(err){
        console.log("somthing is wrong")
        return res.redirect("back")
    }
}