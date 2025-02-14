import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoute from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from 'cookie-parser';
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import  path from "path"
import cors from "cors"
dotenv.config() //if you want to use .env file then in backened then you have to use this
const app=express();
app.use(express.json())
 //to show backened data in console
 app.use(cookieParser())
 
 app.use(cors({ origin: "http://localhost:5173", credentials: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log("MongoDB is connected")
}).catch((err)=>{
    console.log(err)
})

const __dirname=path.resolve()

app.use("/api/user",userRoute)
app.use("/api/auth",authRouter)
app.use("/api/post",postRouter)
app.use('/api/comment',commentRouter)

app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
})

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'Internal server';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})

app.listen(3000,()=>{
    console.log('Server running on port 3000');
});