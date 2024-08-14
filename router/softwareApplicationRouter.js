const express=require("express");
const { isAuthenticated } = require("../middleware/auth");
const { addNewApplication, getAllApplications, deleteApplication } = require("../controllers/softwareApplication-controller");

const router = express.Router();

router.post("/add",isAuthenticated,addNewApplication)
router.delete("/delete/:id",isAuthenticated,deleteApplication)
router.get("/getall", getAllApplications);


module.exports=router