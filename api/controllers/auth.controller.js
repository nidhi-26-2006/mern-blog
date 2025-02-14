import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken"

export const signUp =async(req,res,next)=>{
    const {username,email,password}=req.body;

    if(!username||!password||!email){
        next(errorHandler(400,"All fields are required"))

    }

    const hashedPassword=bcryptjs.hashSync(password,10)
 const newUser=new User({
    username,
    email,
    password:hashedPassword
 })
 try {
    await newUser.save();
 res.json("SignUp successfully")
    
 } catch (error) {
    next(error)
 }
 

} 
export const signIn=async (req,res,next) => {
   const {email,password}=req.body;
   if(!email||!password){
      next(errorHandler(400,"All fields are required"))
   }
   try {
      const validUser=await User.findOne({email});
      if(!validUser){
         next(errorHandler(404,"User not found"))
      }
      
      const token=jwt.sign({
         id:validUser._id,Admin:validUser.Admin
      }, process.env.JWT_SECRET
   
   )
   const {password:pass,...rest}=validUser._doc;
   res.status(200)
   .cookie('access_token',token,{
      httpOnly:true,
   })
   .json(rest)
   
   } catch (error) {
      next(error)
   }
}

export const google=async(req,res,next)=>{
   const {email,name,googlePhotoUrl}=req.body;
   console.log("Received data:", req.body);
   try {
      const user=await User.findOne({email})
      if(user){
      const token=jwt.sign({
         id:user._id,Admin:user.Admin
      },process.env.JWT_SECRET);
      const {password,...rest}=user._doc;
      res.status(200).cookie("accesss_token",token,{
         httpOnly:true
      }).json(rest)
      }else{
             const generatePassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
             const hashedPassword=bcryptjs.hashSync(generatePassword,10);

             const newUser=new User({
               username:name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
               email,
               password:hashedPassword,
               profilePicture:googlePhotoUrl
             });

             await newUser.save();

             const token=jwt.sign({
               id:newUser._id
             },process.env.JWT_SECRET)
const {password,...rest}=newUser._doc;
res.status(200).cookie("access_token",token,{
   httpOnly:true
}).json(rest);



      
      
      
            }
   } catch (error) {
      next(error)
   }
}