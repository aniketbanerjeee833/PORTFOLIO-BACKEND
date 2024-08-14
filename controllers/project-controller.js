const Project = require("../models/projectSchema")
const { v2: cloudinary } = require("cloudinary");
const ErrorHandler = require("../utils/utilities");

const addNewProject = async (req, res, next) => {

    try { 
      
      if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Project Banner Image Required!", 404));
    }

          console.log(req.files)
          const { projectBanner } = req.files;
        const { title, description, gitRepoLink, projectLink, technologies, stack, deployed } = req.body

        if (!title || !description || !gitRepoLink || !projectLink || !stack || !technologies || !deployed) {
            return next(new ErrorHandler("Please Provide All Details!", 400));
        }
        const cloudinaryResponse = await cloudinary.uploader.upload(
            projectBanner.tempFilePath,
            { folder: "PORTFOLIO PROJECT IMAGES" }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("cloudinary error", cloudinaryResponse.error || "Unknown error")
            return next(new ErrorHandler("failed to upload to cloudinary", 500))
        }
        const project = await Project.create({
            title, description, gitRepoLink, projectLink, technologies, stack, deployed,
            projectBanner: {
                public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
                url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
            },
        })

        console.log(project)

        res.status(201).json({
            success: true,
            message: "New Project Added!",
            project,
        });



    } catch (error) {
       
        console.log(error)
        next(error)
    }

}

const deleteProject=async(req,res,next)=>{
    try{
        const{id}=req.params;
        const project=await Project.findById(id)
        if (!project) {
            return next(new ErrorHandler("Already Deleted!", 404));
          }
          const projectImageId = project.projectBanner.public_id;
          await cloudinary.uploader.destroy(projectImageId);
          await project.deleteOne();
          res.status(200).json({
            success: true,
            message: "Project Deleted!",
          });
        
    }catch(error)
    {
      
        console.log(error)
        next(error)
    }
}

const getAllProjects=async(req,res,next)=>{
    try{
        const project = await Project.find();
        res.status(200).json({
          success: true,
          project,
        });
   
    }catch(error)
    {
       
        console.log(error)
        next(error)
    }
}
const getSingleProject=async(req,res,next)=>
{
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      res.status(200).json({
        success: true,
        project,
      });
    } catch (error) {
      next(error)
      res.status(400).json({
        error,
      });
    
    }
  
}

const updateProject=async(req,res,next)=>
{
  try{
    const{id}=req.params
    const defaultProjectData=await Project.findById(id)
    const newProjectData = {
        title: req.body.title||defaultProjectData.title,
        description: req.body.description||defaultProjectData.description,
        stack: req.body.stack||defaultProjectData.stack,
        technologies: req.body.technologies||defaultProjectData.technologies,
        deployed: req.body.deployed||defaultProjectData.deployed,
        projectLink: req.body.projectLink||defaultProjectData.projectLink,
        gitRepoLink: req.body.gitRepoLink||defaultProjectData.gitRepoLink,
      };
      if (req.files && req.files.projectBanner) {
        const projectBanner = req.files.projectBanner;
        const project = await Project.findById(req.params.id);
        const projectImageId = project.projectBanner.public_id;
        await cloudinary.uploader.destroy(projectImageId);
        const newProjectImage = await cloudinary.uploader.upload(
          projectBanner.tempFilePath,
          {
            folder: "PORTFOLIO PROJECT IMAGES",
          }
        );
        newProjectData.projectBanner = {
          public_id: newProjectImage.public_id,
          url: newProjectImage.secure_url,
        };
      }
      const project = await Project.findByIdAndUpdate(req.params.id,newProjectData,{new: true,runValidators: true,useFindAndModify: false});
      res.status(200).json({
        success: true,
        message: "Project Updated!",
        project,
      });
    
}catch(error){
console.log(error)
next(error)
}
}
module.exports={addNewProject,deleteProject,getAllProjects,getSingleProject,updateProject}