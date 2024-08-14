const express=require("express");
const { sendMessage, getAllMessages, deleteMessages } = require("../controllers/message-controller");
const router = express.Router();

router.post("/send",sendMessage)
router.get("/getall",getAllMessages)
router.delete("/delete/:id",deleteMessages)

module.exports=router