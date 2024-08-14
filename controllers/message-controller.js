const Message = require("../models/messageSchema")
const { receiveEmail } = require("../utils/receiveEmail")
const ErrorHandler = require("../utils/utilities")

const sendMessage = async (req, res, next) => {
    try {

        const { senderName, email, message } = req.body
        if (!senderName ||!email || !message) return next(new ErrorHandler("Please fill full form", 404))

    //const user = await User.findOne({ email: req.body.email })
    //if (!user) return next(new ErrorHandler("User not found", 404))
    //const resetToken = user.getResetPasswordToken()
    //await user.save({ validateBeforeSave: false })
    //const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
    //const message1 = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If 
    //You've not requested this email then, please ignore it.`;
    try {

        await receiveEmail({
            senderName,
            email: email,
             message,
           
        });

        const description = await Message.create({
            senderName, email, message
        })

        return res.status(201).json({
            success:true,
            message:"Message sent  successfully",
           description
        })
        // res.status(201).json({
        //     success: true,
        //     message: `Email sent to ${user.email} successfully`,
        // });

    } catch (error) {
        // user.resetPasswordToken = undefined;
        // user.resetPasswordExpire = undefined;
        // await user.save({ validateBeforeSave: false });
        console.log(error)
        return next(new ErrorHandler(error.message, 500));
     

    }

      


    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAllMessages=async(req,res,next)=>{
    try{

        const messages=await Message.find()
        return res.status(200).json({
            success:true,
            messages
        })


    }catch(error)
    {
        console.log(error)
        next(error)
    }
}

//DELETE  MESSAGES
const deleteMessages=async(req,res,next)=>{
    try{

        const{id}=req.params
        const message=await Message.findById(id)
        if(!message) return next(new ErrorHandler("Message already deleted", 400))
        await message.deleteOne()
        return res.status(200).json({
            success:true,
            message:"Message deleted"
        })


    }catch(error)
    {
        console.log(error)
        next(error)
    }
}



module.exports = { sendMessage,getAllMessages,deleteMessages }