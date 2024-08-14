const express=require("express")
const { isAuthenticated } = require("../middleware/auth");
const { addNewProject, deleteProject, getAllProjects, updateProject,getSingleProject } = require("../controllers/project-controller");

const router = express.Router();


router.post("/add", isAuthenticated, addNewProject);
router.delete("/delete/:id", isAuthenticated, deleteProject);
router.put("/update/:id", isAuthenticated, updateProject);
router.get("/getall", getAllProjects);
router.get("/get/:id", getSingleProject);


module.exports=router