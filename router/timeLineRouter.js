const express=require("express");

const { postTimeline, deleteTimeline, getAllTimelines } = require("../controllers/timeLine-controller");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.post("/add",isAuthenticated,postTimeline)
router.delete("/delete/:id",isAuthenticated,deleteTimeline)
router.get("/getall",getAllTimelines)

module.exports=router