const category=require("../model/categorymodel");
const Blog=require("../model/blogmodel");
const comment=require("../model/commentmodel");
const User=require("../model/usermodel")

module.exports.home=async(req,res)=>{
    try{
        let search='';
        if(req.query.usersearch){
       search=req.query.usersearch
       }

       let per_page=3;
    let page=0;
    if(req.query.page){
      page=req.query.page
    }
       
       let allctegory=await category.find({categorystatus:true,});
       let allblog;

       let allblogcount=await Blog.find({blogstatus:true}).countDocuments();

       let sortdata='';
       if(req.query.sorting){
        sortdata=req.query.sorting
       }

       let sortID='';
       if(req.query.catid){
        sortID=req.query.catid
       }

       if(req.query.catid){
        if(req.query.sorting=='Asce'){
            allblog=await Blog.find({blogstatus:true,categoryId:req.query.catid,
                $or :[
                    
                    {titlename:{$regex:search}}
                  
                ]
               }).skip(per_page*page).limit(per_page).sort({_id:-1});
        }
        else{
            allblog=await Blog.find({blogstatus:true,categoryId:req.query.catid,
                $or :[
                    
                    {titlename:{$regex:search}}
                  
                ]
               }).skip(per_page*page).limit(per_page).sort({_id:1});
        }
       
       }
       else{
        if(req.query.sorting=='Dese'){
            allblog=await Blog.find({blogstatus:true,
                $or :[
                    
                    {titlename:{$regex:search}}
                  
                ]
               }).skip(per_page*page).limit(per_page).sort({_id:-1});
        }
        else{
            allblog=await Blog.find({blogstatus:true,
                $or :[
                    
                    {titlename:{$regex:search}}
                  
                ]
               }).skip(per_page*page).limit(per_page).sort({_id:1});
        }
     
       }
       

       let totalcount=await Blog.find({blogstatus:true,
        $or :[
            
            {titlename:{$regex:search}}
          
        ]
       }).countDocuments();

       var totalpage=Math.ceil(totalcount/per_page);
      
        return res.render("userpanel/home",{
            allctegory,
            allblog,search,
            totalpage,
            page,
            allblogcount,
            sortdata,
            sortID
        })
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back")
    }
}

module.exports.readmore=async(req,res)=>{
    try{
        let PostId=req.params.id
        let search='';
        if(req.query.readsearch){
       search=req.query.readsearch
       }
    
        id=req.params.id;
        let viewcomment=await comment.find({blogstatus:true,PostId:req.params.id});
        let singleuser=await Blog.findById(id);
        let allblog=await Blog.find({
            $or :[
            
                {titlename:{$regex:search}}
              
            ]
        }).sort({_id:-1}).limit(5);;

       
        
        if(singleuser){
            return res.render("userpanel/readmore",{
                singleuser,
                allblog,
                search,
                PostId,
                viewcomment
               
            })
        }
                     
          
        }
    
    catch{
        console.log("somthing is wrong");
        return res.redirect("back");
    }
    
   
}

module.exports.addcomment=async(req,res)=>{
    // console.log(req.body);
    // console.log(req.file);
    let commentimages=''
    if(req.file){
        commentimages=await comment.imgcommentpath+"/"+req.file.filename;

    }
    req.body.images=commentimages;
    let addcomment=await comment.create(req.body);
    if(addcomment){
        let commentfind=await Blog.findById(req.body.PostId);
        commentfind.commentId.push(addcomment._id)
        await Blog.findByIdAndUpdate(req.body.PostId,commentfind)
    }

    return res.redirect("back")
}

module.exports.commentview=async(req,res)=>{
 
    let commentshow=await comment.find()
    return res.render("userpanel/commentview",{
        commentshow,
        
    });
}

module.exports.changestatustrue=async(req,res)=>{
    try{
        let statusblogupdate=await comment.findByIdAndUpdate(req.query.camid,{'blogstatus':false});
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
        let statusblogupdate=await comment.findByIdAndUpdate(req.query.camid,{'blogstatus':true});
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

module.exports.userregister=async(req,res)=>{
    try{
        return  res.render("userpanel/userregister")
    }
    catch{
        console.log("somthiing is wrong");
        return res.redirect("back");
    }
}

module.exports.userregisterdata=async(req,res)=>{
    try{
        if(req.body.password==req.body.confirmuserpassword){
            let userregidata=await User.create(req.body)
            if(userregidata){
                console.log("register data sucefully add")
                return res.redirect("back");

            }
            else{
                console.log("data not add");
                return res.redirect("back")
            }

           
        }
        else{
            console.log("password and confirm password are not match")
        }
    }
     catch{
        console.log("somthiing is wrong");
        return res.redirect("back");
    }
}

module.exports.userlogin=async(req,res)=>{
    try{
        return  res.render("userpanel/userlogin")
    }
    catch{
        console.log("somthiing is wrong");
        return res.redirect("back");
    }
}

module.exports.userrlogindata=async (req,res) => {
    try{
        return res.redirect("/")
    }
    catch{
        console.log("somthiing is wrong");
        return res.redirect("back");
    }
}

module.exports.setuserlike=async(req,res)=>{
    try{
        // console.log(req.params.commentId);
        let singlelikedata=await comment.findById(req.params.commentId);

        if(singlelikedata){
            console.log(req.user._id);
            let userlikedataexit=singlelikedata.likes.includes(req.user._id)
            if(userlikedataexit){
                let  newuserlikedata=singlelikedata.likes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                   
                    
                })
                singlelikedata.likes=newuserlikedata;

            }
            else{
                 singlelikedata.likes.push(req.user._id);
               
            }
            await comment.findByIdAndUpdate(req.params.commentId,singlelikedata);
            let userdislikedataexit=singlelikedata.dislikes.includes(req.user._id)
            if(userdislikedataexit){
                let  newuserlikedata=singlelikedata.dislikes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                   
                    
                })
                singlelikedata.dislikes=newuserlikedata;
                await comment.findByIdAndUpdate(req.params.commentId,singlelikedata);

            }
            return res.redirect("back")
        }


    }
    catch(err){
        console.log("somthiing is wrong",err);
        return res.redirect("back");
    }
}

module.exports.setuserdislike=async(req,res)=>{
    try{
        // console.log(req.params.commentId);
        let singlelikedata=await comment.findById(req.params.commentId);

        if(singlelikedata){
            console.log(req.user._id);
            let userlikedataexit=singlelikedata.dislikes.includes(req.user._id)
            if(userlikedataexit){
                let  newuserlikedata=singlelikedata.dislikes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                   
                    
                })
                singlelikedata.dislikes=newuserlikedata;

            }
            else{
                 singlelikedata.dislikes.push(req.user._id);
               
            }
            await comment.findByIdAndUpdate(req.params.commentId,singlelikedata);
            let likedataexit=singlelikedata.likes.includes(req.user._id)
            if(likedataexit){
                let  newuserlikedata=singlelikedata.likes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                   
                    
                })
                singlelikedata.likes=newuserlikedata;
                await comment.findByIdAndUpdate(req.params.commentId,singlelikedata);

            }
            return res.redirect("back")
        }


    }
    catch(err){
        console.log("somthiing is wrong",err);
        return res.redirect("back");
    }
}

module.exports.userlogout=async(req,res)=>{
    try{
        req.session.destroy(function(err){
            if(err){
                return false
            }
            else{
                return res.redirect("/");
            }
        })
    }
    catch{
        console.log("somthiing is wrong");
        return res.redirect("back");
    }
}