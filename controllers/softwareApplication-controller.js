const ErrorHandler = require("../utils/utilities")
const { v2: cloudinary } = require("cloudinary")
const softwareApplication=require("../models/softwareSchema")

//ON LEFT HAND SIDE ICON CLICK

//ADD TO SCHEMA AS WELL AS CLOUDINARY
const addNewApplication=async(req,res,next)=>
{

    try{
        if(!req.files||Object.keys(req.files).length===0) return next(new ErrorHandler("Software application icon required",404))
        const{svg}=req.files;
        const{name}=req.body;
        if(!name)  return next(new ErrorHandler("Please Provide Software's Name!", 400));
          
          const cloudinaryResponse=await cloudinary.uploader.upload(
            svg.tempFilePath,
            { folder: "PORTFOLIO SOFTWARE APPLICATION IMAGES" }
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("cloudinary error", cloudinaryResponse.error || "Unknown error")
            return next(new ErrorHandler("failed to upload to cloudinary", 500))
        }
        const softwareapplication=await softwareApplication.create({
            name,
            svg: {
                public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
                url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
            },
        })
        console.log(softwareapplication)
        res.status(201).json({
            success: true,
            message: "New Software Application Added!",
            softwareapplication,
          });
     

          
    }catch(error)
    {
    
        console.log(error)
        next(error)
    }
}
//DELETE FROM CLOUDINARY
const deleteApplication=async(req,res,next)=>
{
    try{
        const{id}=req.params;
        const softwareapplication=await softwareApplication.findById(id)
        if (!softwareApplication) {
            return next(new ErrorHandler("Already Deleted!", 404));
          }
          const softwareApplicationSvgId = softwareapplication.svg.public_id;
          await cloudinary.uploader.destroy(softwareApplicationSvgId);
          await softwareapplication.deleteOne();
          
          res.status(200).json({
            success: true,
            message: "Software Application Deleted!",
          });
        
    }catch(error)
    {
     
        console.log(error)
        next(error)
    }
}

const getAllApplications=async(req,res,next)=>
{
    try{
        const softwareapplications = await softwareApplication.find();
        res.status(200).json({
          success: true,
          softwareapplications,
        });
   
    }catch(error)
    {
       
        console.log(error)
        next(error)
    }
}
module.exports={addNewApplication,deleteApplication,getAllApplications}