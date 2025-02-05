const mongoose=require("mongoose");

const imagecommentpath="/Uploads/commentimge";

const multer=require("multer");
const { type } = require("os");


const path=require("path");


const CommentSchema=mongoose.Schema({
    PostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog",
        required:true
    },

    username:{
            type:String,
            required:true
    },
    useremail:{
        type:String,
        required:true
    },
    blogstatus:{
        type:Boolean,
        required:true,
        default:true
    },
    images:{
        type:String,
        required:true
    },
    usercomment:{
        type:String,
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],


},{
    timestamps:true
})

const storageimagecomment=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"..",imagecommentpath))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }
    
})

CommentSchema.statics.Uploadcomentimage=multer({storage:storageimagecomment}).single("images");
CommentSchema.statics.imgcommentpath=imagecommentpath;



const comment=mongoose.model("comment",CommentSchema);

module.exports=comment;