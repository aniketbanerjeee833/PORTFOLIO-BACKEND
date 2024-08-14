const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")
const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    aboutMe: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    resume: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    portfolioURL: {
      type: String,
    
    },
    githubURL: {
      type: String,
    },
   
  
    linkedInURL: {
      type: String,
    },
  
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  });
  

  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });
  
userSchema.methods.comparePassword=async function(userPassword){
return isMatch=await bcrypt.compare(userPassword,this.password)

}

userSchema.methods.createJwt= function(){
return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}
   
//Generating Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and Adding Reset Password Token To UserSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Setting Reset Password Token Expiry Time
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports=mongoose.model("user",userSchema)
