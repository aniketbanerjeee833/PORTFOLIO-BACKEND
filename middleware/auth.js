
const jwt=require("jsonwebtoken")
const User=require("../models/userSchema")
const ErrorHandler = require("../utils/utilities")
const isAuthenticated=async(req,res,next)=>
{
    try{
        const token=req.cookies["token"]
        if(!token) return next(new ErrorHandler("Please login to access this route",401))
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded)
        req.user = await User.findById(decoded.id);
        next();
    }catch(error)
    {
        console.log(error)
    }
   
}

module.exports={isAuthenticated}


