

const generateToken = (user, message, statusCode, res)=>{

const token = user.createJwt();



  res.status(statusCode)
  .cookie("token", token, {expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),httpOnly: true,sameSite:none,secure:true})
  .json({success: true,message,user,token})
}

module.exports={generateToken}