const express=require("express");
const { register, login, logout, getUser, updateProfile, getUserForPortfolio, forgotPassword, resetPassword, updatePassword } = require("../controllers/user-controller");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.get("/portfolio/me",getUserForPortfolio)
router.get("/logout",isAuthenticated,logout)
router.get("/me",isAuthenticated,getUser)
router.put("/update/profile",isAuthenticated,updateProfile)
router.put("/update/password",isAuthenticated,updatePassword)
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);


module.exports=router