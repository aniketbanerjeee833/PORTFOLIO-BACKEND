const mongoose=require("mongoose")

const timeLineSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title required"]
    },
    description:{
        type:String,
        required:[true,"Title required"]
    },
    timeline:{
        from:{
            type:String
        },
        to:{
            type:String
        }
    }
})

module.exports=mongoose.model("timeLine",timeLineSchema)