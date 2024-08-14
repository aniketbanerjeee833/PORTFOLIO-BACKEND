const ErrorHandler = require("../utils/utilities");

const errorMiddleware=(err,req,res,next)=>
    {
        err.message ||= "Internal Server Error";
        err.statusCode ||= 500;
      
    
        //DUPLICATE CASE
        if (err.code === 11000) {
            const error = Object.keys(err.keyPattern).join(",");
            err.message = `Duplicate field - ${error}`;
            err.statusCode = 400;
        }
        if (err.name === "JsonWebTokenError") {
            const message = `Json Web Token is invalid, Try again!`;
            err = new ErrorHandler(message, 400);
          }
          if (err.name === "TokenExpiredError") {
            const message = `Json Web Token is expired, Try again!`;
            err = new ErrorHandler(message, 400);
          }
         if (err.name === "CastError") {
             const errorPath = err.path;
            err.message = `Invalid Format of ${errorPath}`;
             err.statusCode = 400;
           }
           const response = {
            success: false,
            message: err.message,
          }
          return res.status(err.statusCode).json(response)
    }
    module.exports= {errorMiddleware}