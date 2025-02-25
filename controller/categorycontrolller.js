const category=require("../model/categorymodel");
const {validationResult}=require("express-validator")
module.exports.addcategory=async(req,res)=>{
    try{
            return res.render("category/addcategory",{
                errordata:[],
                olddata:[]

            });
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back");
    }
}

module.exports.insertcategory=async(req,res)=>{
    try{

        const error=validationResult(req);
        console.log(error)
        console.log(error.mapped())
        if(!error.isEmpty()){
           return res.render("category/addcategory",{
            errordata:error.mapped(),
            olddata:req.body

           })
        }
      else{
          let categoryData=await category.create(req.body);
        if(categoryData){
            req.flash("success","category add sucefully");
            // console.log("category add sucefully");
            return res.redirect("/category")
        }
        else{
            req.flash("success","qury is not perform");
            // console.log("qury is not perform");
            return res.redirect("back")
        }
      }      
    }
    catch{
        console.log("somthing is wrong");
        return res.redirect("back")
    }
}
module.exports.viewcategory=async(req,res)=>{
   
   
         let search='';
     if(req.query.categorysearch){
    search=req.query.categorysearch
    }

    let per_page=3;
    let page=0;
    if(req.query.page){
      page=req.query.page
    }
   
        let categoryshow=await category.find({
            $or :[
            
                {categoryname:{$regex:search}}
              
            ]
        }).skip(per_page*page).limit(per_page);

        let totalcount=await category.find({
            $or :[
            
                {categoryname:{$regex:search}}
              
            ]
            
        }).countDocuments();

        var totalpage=Math.ceil(totalcount/per_page);
        return res.render("category/viewcategory",{
            categoryshow,
            search, 
             totalpage,
            page
        })
   
}

module.exports.deletemultiple=async(req,res)=>{
    try{
        let deletecategory=await category.deleteMany({_id:{$in:req.body.Ids}});
        if(deletecategory){
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

module.exports.changetrue=async(req,res)=>{
    try{
        console.log(req.query);
        let catstatusupdate=await category.findByIdAndUpdate(req.query.stuid,{"categorystatus":false});
        if(catstatusupdate){
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
        console.log("somthing is wrong")
        return res.redirect("back")
    }
}

module.exports.changefalse=async(req,res)=>{
    try{
        console.log(req.query);
        let catstatusupdate=await category.findByIdAndUpdate(req.query.stuid,{"categorystatus":true});
        if(catstatusupdate){
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
        console.log("somthing is wrong")
        return res.redirect("back")
    }
}

module.exports.asecending=async(req,res)=>{
   
    let search='';
    if(req.query.categorysearch){
   search=req.query.categorysearch
   }

   let per_page=3;
   let page=0;
   if(req.query.page){
     page=req.query.page
   }
  
       let categoryshow=await category.find({
           $or :[
           
               {categoryname:{$regex:search}}
             
           ]
       }).skip(per_page*page).limit(per_page).sort({categoryname:1})

       let totalcount=await category.find({
           $or :[
           
               {categoryname:{$regex:search}}
             
           ]
           
       }).countDocuments();

       var totalpage=Math.ceil(totalcount/per_page);
       return res.render("category/viewcategory",{
           categoryshow,
           search, 
            totalpage,
           page
       })
  
}

module.exports.desecending=async(req,res)=>{
    let search='';
    if(req.query.categorysearch){
   search=req.query.categorysearch
   }

   let per_page=3;
   let page=0;
   if(req.query.page){
     page=req.query.page
   }
  
       let categoryshow=await category.find({
           $or :[
           
               {categoryname:{$regex:search}}
             
           ]
       }).skip(per_page*page).limit(per_page).sort({categoryname:-1})

       let totalcount=await category.find({
           $or :[
           
               {categoryname:{$regex:search}}
             
           ]
           
       }).countDocuments();

       var totalpage=Math.ceil(totalcount/per_page);
       return res.render("category/viewcategory",{
           categoryshow,
           search, 
            totalpage,
           page
       })
  
}
