const path = require("path");
const Blog=require("../model/blogmodel");
const category=require("../model/categorymodel");
const fs=require("fs");
const {validationResult}=require("express-validator")

module.exports.addblog=async(req,res)=>{
    try{
        let categoryData=await category.find();
        return res.render("Blog/addblog",{
            categoryData,
            errordata:[],
            olddata:[]
        });
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back");
    }
}

module.exports.insertblog = async (req, res) => {
    try {
         const error=validationResult(req);
                console.log(error)
                console.log(error.mapped())
                let categoryData=await category.find();
                if(!error.isEmpty()){
                   return res.render("Blog/addblog",{
                    errordata:error.mapped(),
                    olddata:req.body,
                    categoryData
        
                   })
                }
       else{
        let imagesblogPath = "";
        if (req.file) {
            console.log("Uploaded File:", req.file);
            imagesblogPath = Blog.imgblogpath + "/" + req.file.filename;
        }
        req.body.avtar = imagesblogPath;

        

       
        let blogdata = await Blog.create(req.body);
        if (blogdata) {
            let findcategory=await category.findById(req.body.categoryId);
            findcategory.blogid.push(blogdata._id);
            await category.findByIdAndUpdate(req.body.categoryId,findcategory);
            req.flash("success","Blog data added successfully:");
            // console.log("Blog data added successfully:");
            return res.redirect("/blogs/viewblog");
        } else {
            req.flash("success","Blog data insertion failed");
            // console.log("Blog data insertion failed");
            return res.redirect("back");
        }
       }
    } catch (err) {
        console.error("Error while inserting blog:", err);
        return res.redirect("back");
    }
};




module.exports.viewblog=async(req,res)=>{
   
    let search="";
    //   console.log(req.query.blogsearch);
      if(req.query.blogsearch){
         search=req.query.blogsearch;
      }

      let per_page=3;
  let page=0;
  if(req.query.page){
    page=req.query.page
  }
        let blogshow=await Blog.find({
          
            $or :[
            
                {titlename:{$regex:search}},
               
            ]
        }).skip(per_page*page).limit(per_page).populate("categoryId").exec();

        let totalcount=await Blog.find({
            $or :[
            
                {titlename:{$regex:search}},
               
            ]
            
        }).countDocuments();

        var totalpage=Math.ceil(totalcount/per_page);
        return res.render("Blog/viewblog",{
            blogshow,
            search,
            totalpage,
            page
        })
    }
    


module.exports.updateblog=async(req,res)=>{
    try{
        id=req.query.blogid;
        let singblog=await Blog.findById(id);
        const categoryData = await category.find();
       
       
            return res.render("Blog/updateblog",{
                singblog,
                categoryData
              
            })
        
       
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back");
    }
}

module.exports.editblog=async(req,res)=>{
    try{

        if(req.file){
            let singleblogdata=await Blog.findById(req.body.eid);
            try{
                let oldimageblog=path.join(__dirname,"..",singleblogdata.avtar);
                req.body.avtar=oldimageblog;
                fs.unlinkSync(oldimageblog);
            }
            catch{
                req.flash("success","image not found");
                // console.log("image not found");
            }
            let newblogimg=await Blog.imgblogpath+"/"+req.file.filename;
            req.body.avtar=newblogimg
           
            let updateblogdata=await Blog.findByIdAndUpdate(req.body.eid,req.body);
            if(updateblogdata){
                req.flash("success","data update sucefully");
                // console.log("data update sucefully");
                return res.redirect("/blogs/viewblog")
             }
             else{
                req.flash("success","data not update");
                // console.log("data not update");
                return res.redirect("back");
             }

        }
        else{
            let singleblogdata=await Blog.findById(req.body.eid);
            req.body.avtar=singleblogdata.avtar;
            let updateblogdata=await Blog.findByIdAndUpdate(req.body.eid,req.body);
            if(updateblogdata){
                req.flash("success","data update sucefully");
                // console.log("data update sucefully");
                return res.redirect("/blogs/viewblog")
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

module.exports.deleteblog=async(req,res)=>{
    try{
        let getdata=await Blog.findById(req.query.id);
       if(getdata){
               try{
                   deleteimg=path.join(__dirname,"..",getdata.avtar);
                   fs.unlinkSync(deleteimg);
               }
               catch{
                   req.flash("success","image not found");
                //    console.log("image not found")
                   return res.redirect("back");
               }

               let deletepaths= await Blog.findByIdAndDelete(req.query.id);
               if(deletepaths){
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

module.exports.deletemultipleblog=async(req,res)=>{
    try{
        let deleteblogs=await Blog.deleteMany({_id:{$in:req.body.idblog}});
        if(deleteblogs){
            req.flash("success","data delete");  
                // console.log("data delete")
            return res.redirect("back");
        }
        else{
            req.flash("success","data not delete"); 
            //  console.log("data not delete")
            return res.redirect("back");
        }
    }
    catch(err){
        console.log("somthing is wrong")
        return res.redirect("back")
    }
}

module.exports.changestatustrue=async(req,res)=>{
    try{
        let statusblogupdate=await Blog.findByIdAndUpdate(req.query.catid,{'blogstatus':false});
        if(statusblogupdate){
            req.flash("success","status false change sucefully"); 
            return res.redirect("back")
        }
        else{
            req.flash("success","data failed"); 
        // console.log("data failed");
        return res.redirect("back")

        }
    }
    catch{
        console.log("somthiing is wrong");
        return res.redirect("back");
    }
}

module.exports.changestatusfalse=async(req,res)=>{
    try{
        let statusblogupdate=await Blog.findByIdAndUpdate(req.query.catid,{'blogstatus':true});
        if(statusblogupdate){
            req.flash("success","status true change sucefully"); 
            return res.redirect("back")
        }
        else{
            req.flash("success","data failed"); 
            // console.log("data failed");
        return res.redirect("back")

        }
    }
    catch{
        console.log("somthiing is wrong");
        return res.redirect("back");
    }

}

module.exports.asecendingblog=async(req,res)=>{
    let search="";
    //   console.log(req.query.blogsearch);
      if(req.query.blogsearch){
         search=req.query.blogsearch;
      }

      let per_page=3;
  let page=0;
  if(req.query.page){
    page=req.query.page
  }
        let blogshow=await Blog.find({
          
            $or :[
            
                {titlename:{$regex:search}},
               
            ]
        }).skip(per_page*page).limit(per_page).sort({titlename:1}).populate("categoryId").exec();

        let totalcount=await Blog.find({
            $or :[
            
                {titlename:{$regex:search}},
               
            ]
            
        }).countDocuments();

        var totalpage=Math.ceil(totalcount/per_page);
        return res.render("Blog/viewblog",{
            blogshow,
            search,
            totalpage,
            page
        })
}
module.exports.desecendingblog=async(req,res)=>{
    let search="";
    //   console.log(req.query.blogsearch);
      if(req.query.blogsearch){
         search=req.query.blogsearch;
      }

      let per_page=3;
  let page=0;
  if(req.query.page){
    page=req.query.page
  }
        let blogshow=await Blog.find({
          
            $or :[
            
                {titlename:{$regex:search}},
               
            ]
        }).skip(per_page*page).limit(per_page).sort({titlename:-1}).populate("categoryId").exec();

        let totalcount=await Blog.find({
            $or :[
            
                {titlename:{$regex:search}},
               
            ]
            
        }).countDocuments();

        var totalpage=Math.ceil(totalcount/per_page);
        return res.render("Blog/viewblog",{
            blogshow,
            search,
            totalpage,
            page
        })
}


