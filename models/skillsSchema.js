const mongoose=require("mongoose")
const skillsSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    proficiency:{
        type:String,
    },
    svg:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
})

module.exports=mongoose.model("skills",skillsSchema)