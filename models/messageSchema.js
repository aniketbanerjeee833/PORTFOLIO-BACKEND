const mongoose=require("mongoose")


const messageSchema=new mongoose.Schema({
    senderName:{
        type:String,
        minLength: [2, "Name Must Contain At Least 2 Characters!"],
    },
  
    message:{
        type:String,
        minLength:[2, "message Must Contain At Least 2 Characters!"]
    },
    email: {
        type: String,
        required: true
      },
    createdAt: {
        type: Date,
        default: Date.now(),
      },
})
module.exports=mongoose.model("message",messageSchema)