const mongoose=require("mongoose");

const imageblogpath="/Uploads/Blogsimages";

const multer=require("multer");

const path=require("path");


const BlogSchema=mongoose.Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    titlename:{
            type:String,
            required:true
    },
    aboutname:{
        type:String,
        required:true
    },
    blogstatus:{
        type:Boolean,
        required:true,
        default:true
    },
    avtar:{
        type:String,
        required:true
    },
    commentId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment",
      
    }]
       
    },


{
    timestamps:true
})

const storageimageblog=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"..",imageblogpath))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }
    
})

BlogSchema.statics.Uploadblogimage=multer({storage:storageimageblog}).single("avtar");
BlogSchema.statics.imgblogpath=imageblogpath;



const Blog=mongoose.model("Blog",BlogSchema);

module.exports=Blog;