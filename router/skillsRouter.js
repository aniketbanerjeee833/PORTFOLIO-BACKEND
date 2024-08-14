const express=require("express");
const { isAuthenticated } = require("../middleware/auth");
const { addNewSkills, deleteSkills, getAllSkills, updateSkills } = require("../controllers/skills-controller");


const router = express.Router();

router.post("/add",isAuthenticated,addNewSkills)
router.delete("/delete/:id",isAuthenticated,deleteSkills)
router.put("/update/:id",isAuthenticated,updateSkills)
router.get("/getall", getAllSkills);


module.exports=router