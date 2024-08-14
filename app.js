require("dotenv").config()
const express = require("express");

const app = express();

const connectDB = require("./db/connect")


const { v2: cloudinary } = require("cloudinary")
const cors=require("cors")

const cookieParser = require("cookie-parser")

const { errorMiddleware } = require("./middleware/error");
const userRouter=require("./router/userRoutes")
const messageRouter=require("./router/messageRoutes")
const timeLineRouter=require("./router/timeLineRouter")
const softwareApplicationRouter=require("./router/softwareApplicationRouter")
const projectRouter=require("./router/projectRouter")
const skillsRouter=require("./router/skillsRouter");
const fileUpload = require("express-fileupload");







cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//MIDDLEWARE

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true,
})
);


app.use(express.urlencoded({
  extended: true
}))

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user",userRouter)
app.use("/api/v1/message",messageRouter)
app.use("/api/v1/timeline",timeLineRouter)
app.use("/api/v1/softwareapplication",softwareApplicationRouter)
app.use("/api/v1/project",projectRouter)
app.use("/api/v1/skill",skillsRouter)




app.use(errorMiddleware);
const port = process.env.PORT
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
   app.listen(port, console.log(`Server listening  on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}
start();



