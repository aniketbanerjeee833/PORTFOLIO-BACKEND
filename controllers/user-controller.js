const ErrorHandler = require("../utils/utilities");
const { v2: cloudinary } = require("cloudinary")
const User = require("../models/userSchema");
const { generateToken, cookieOptions } = require("../utils/jwtToken");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto")

//REGISTER USER(ME) WITH ALL
const register = async (req, res, next) => {

    try {
        const { fullName, email, phone, aboutMe, password, portfolioURL, githubURL, linkedInURL } = req.body;
        //  if(!fullName||!email||!password||!phone||!aboutMe||!portfolioURL||!githubURL||!linkedInURL)
        // {
        //     return next(new ErrorHandler("All fields required",404))
        // }
        const { avatar } = req.files;

        //POSTING AVATAR
        const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            { folder: "PORTFOLIO AVATAR" }
        );
        if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
            console.error(
                "Cloudinary Error:",
                cloudinaryResponseForAvatar.error || "Unknown Cloudinary error"
            );
            return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
        }

        const { resume } = req.files
        const cloudinaryResponseForResume = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "PORTFOLIO RESUME" }
        );
        if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
            console.error(
                "Cloudinary Error:",
                cloudinaryResponseForResume.error || "Unknown Cloudinary error"
            );
            return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
        }

        const user = await User.create({
            fullName, email, phone, aboutMe, password, portfolioURL, githubURL, linkedInURL,

            avatar: {
                public_id: cloudinaryResponseForAvatar.public_id, // Set your cloudinary public_id here
                url: cloudinaryResponseForAvatar.secure_url, // Set your cloudinary secure_url here
            },
            resume: {
                public_id: cloudinaryResponseForResume.public_id, // Set your cloudinary public_id here
                url: cloudinaryResponseForResume.secure_url, // Set your cloudinary secure_url here
            },
        });
        generateToken(user, "Registered!", 201, res);






    } catch (error) {
        console.log(error)
        next(error)
    }

}
//LOGIN
const login = async (req, res, next) => {
    try {


        const { email, password } = req.body;
        if (!email || !password) return next(new ErrorHandler("Please provide email and password", 400))
        const user = await User.findOne({ email }).select("+password")
        if (!user) return next(new ErrorHandler("Invalid username or password", 404))
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) return next(new ErrorHandler("Invalid Email Or Password", 401));
        generateToken(user, "Login Successfully!", 200, res);



    } catch (error) {
        console.log(error)
        next(error)
    }


};

//LOGOUT

const logout = async (req, res, next) => {
    try {


        res.status(200).cookie("token", "", {
            httpOnly: true, expires: new Date(Date.now()),sameSite:"None",secure:true

        })
            .json({
                success: true,
                message: "Logged Out!",
            });
    } catch (error) {
        console.log(error)
        next(error)
    }
}


//GET ME
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.log(error)
        next(error)
    }
}
//UPDATE PROFILE 1.DESTROY OLD IF AVATAR 2.DESTROY OLD RESUME

const updateProfile = async (req, res, next) => {
    try {
        const defaultProfile = await User.findById(req.user.id)
        const newUserData = {
            fullName: req.body.fullName || defaultProfile.fullName,
            email: req.body.email || defaultProfile.email,
            phone: req.body.phone || defaultProfile.phone,
            aboutMe: req.body.aboutMe || defaultProfile.aboutMe,

            portfolioURL: req.body.portfolioURL || defaultProfile.portfolioURL,
            githubURL: req.body.portfolioURL || defaultProfile.githubURL,
            facebookURL: req.body.facebookURL || defaultProfile.facebookURL,
            linkedInURL: req.body.linkedInURL || defaultProfile.linkedInURL
        }
        if (req.files && req.files.avatar) {
            const avatar = req.files.avatar
            const user = await User.findById(req.user.id)
            const profileImageId = user.avatar.public_id
            await cloudinary.uploader.destroy(profileImageId)
            const newProfileImage = await cloudinary.uploader.upload(avatar.tempFilePath, { folder: "PORTFOLIO AVATAR" })
            newUserData.avatar = {
                public_id: newProfileImage.public_id,
                url: newProfileImage.secure_url,
            };
        }
        if (req.files && req.files.resume) {
            const resume = req.files.resume
            const user = await User.findById(req.user.id)
            const profileResumeId = user.resume.public_id
            await cloudinary.uploader.destroy(profileResumeId)
            const newResume = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "PORTFOLIO RESUME" })
            newUserData.avatar = {
                public_id: newResume.public_id,
                url: newResume.secure_url,
            };
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, { new: true, runValidators: true, useFindAndModify: false, });
        return res.status(200).json({
            success: true,
            message: "profile updated",
            user
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

//UPDATE PASSWORD 1.CURRENT PASSWORD NEW PASSWORD CONFIRM NEW PASSWORD
const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body
        if (!confirmNewPassword || !currentPassword || !newPassword) return next(new ErrorHandler("Please fill out all fields", 400))

        const user = await User.findById(req.user.id).select("+password");
        const isPasswordMatched = await user.comparePassword(currentPassword)
        if (!isPasswordMatched) return next(new ErrorHandler("Incorrect current password"))
        if (newPassword !== confirmNewPassword) return next(new ErrorHandler("Password not matching", 400))
        user.password = newPassword

        await user.save()
        //const newUser=await User.findByIdAndUpdate(req.user.id,{password:newPassword},{new:true})
        console.log(user)
        return res.status(200).json({
            success: true,
            message: "password updated",
            user
        })


    } catch (error) {
        console.log(error)
        next(error)

    }
}

const getUserForPortfolio = async (req, res, next) => {

    try {
        const id = "66b88a63af68df6c3818b930"
        const user = await User.findById(id)
        res.status(200).json({
            success: true,
            user: user,
        });
    } catch (error) {
        console.log(error)
        next(error)
    }

}

//FIND USER FROM EMAIL 1.SEND THEM LINK THROUGH EMAIL
const forgotPassword = async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new ErrorHandler("User not found", 404))
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })
    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
    const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If 
    You've not requested this email then, please ignore it.`;
    try {

        await sendEmail({
            email: user.email,
            subject: `Personal Portfolio Dashboard Password Recovery`,
            message,
        });
        res.status(201).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));

    }

}

//RESET PASSWORD 1.USER WILL ENTER A PASSWORD
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        console.log(token)
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        console.log(user)
        if (!user) {
            return next(
                new ErrorHandler(
                    "Reset password token is invalid or has been expired.",
                    400
                )
            );
        }
        console.log(user)
        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("Password & Confirm Password do not match"));
        }
        user.password = await req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        generateToken(user, "Reset Password Successfully!", 200, res);
        
      
    } catch (error) {
        next(error)
        console.log(error)
    }
}


module.exports = { register, login, logout, getUser, updateProfile, updatePassword, getUserForPortfolio, forgotPassword, resetPassword }