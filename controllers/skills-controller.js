const Skill=require("../models/skillsSchema")
const { v2: cloudinary } = require("cloudinary");
const ErrorHandler = require("../utils/utilities");


//ON LEFT HAND SIDE ICON CLICK
const addNewSkills=async(req,res,next)=>
    {
    
        try{
     
            if(!req.files||Object.keys(req.files).length===0) return next(new ErrorHandler("Skills icon required",404))
            const{svg}=req.files;
            console.log(svg)
      
            const{title,proficiency}=req.body;
            console.log(title,proficiency)
            if(!title||!proficiency)  return next(new ErrorHandler("Please Add all details", 400));
           
              const cloudinaryResponse=await cloudinary.uploader.upload(
                svg.tempFilePath,
                { folder: "PORTFOLIO SKILLS IMAGES" }
              );
              if (!cloudinaryResponse || cloudinaryResponse.error) {
                console.error("cloudinary error", cloudinaryResponse.error || "Unknown error")
                return next(new ErrorHandler("failed to upload to cloudinary", 500))
            }
            const skill=await Skill.create({
                title,proficiency,
                svg: {
                    public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
                    url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
                },
            })
            console.log(skill)
            res.status(201).json({
                success: true,
                message: "New skill Added!",
                skill,
              });
         
    
              
        }catch(error)
        {
            
            console.log(error)
            next(error)
        }
    }
    //DELETE FROM CLOUDINARY
const deleteSkills=async(req,res,next)=>
    {
        try{
            const{id}=req.params;
            const skill=await Skill.findById(id)
            if (!skill) {
                return next(new ErrorHandler("Already Deleted!", 404));
              }
              const skillSvgId = skill.svg.public_id;
              await cloudinary.uploader.destroy(skillSvgId);
              await skill.deleteOne();
              res.status(200).json({
                success: true,
                message: "skill Deleted!",
              });
            
        }catch(error)
        {
            
            console.log(error)
            next(error)
        }
    }
    

    //UPDATE SKILLS 
const updateSkills=async(req,res,next)=>
    {
        try{

            const{id}=req.params
            const skillPresent=await Skill.findById(id)
            if(!skillPresent)  return next(new ErrorHandler("Skill not found!", 404))
            const { proficiency } = req.body;
            const skill = await Skill.findByIdAndUpdate(id,{ proficiency },{new: true,runValidators: true,useFindAndModify: false,});
            res.status(200).json({
              success: true,
              message: "Skill Updated!",
              skill,
            })
        }catch(error)

        {
            next(error)
            console.log(error)
        }
    }
const getAllSkills=async(req,res,next)=>
    {
        try{
            const skill = await Skill.find();
            res.status(200).json({
              success: true,
              skill,
            });
       
        }catch(error)
        {
            
            console.log(error)
            next(error)
        }
    }

module.exports={addNewSkills,deleteSkills,getAllSkills,updateSkills}