const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const authentication = require("../middlewares/authentication");
const appliedOppertunity = require("../models/Applied");
const userRouter = express.Router();

userRouter.post("/signup",async(req,res)=>{
    const{username,email,password} = req.body;
    const user = await UserModel.findOne({email});

    if(user){
        return res.json({error:"email already registered",message:"User Already exist"});
    }
    const hashhedPass = await bcrypt.hash(password,10);
    const newUser = new UserModel({
        username:username,
        email:email,
        password:hashhedPass
    });
    await newUser.save();
    res.status(201).json({status:true,message:"User signup Sucessfully"})
})

userRouter.post("/login",async(req,res)=>{
    const {username,email,password} = req.body;
    const user = await UserModel.findOne({email});

    if(!user){
        return res.status(400).json({status:false,message:"User does not exit"});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
       return res.status(400).json({status:false,message:"Password incorrect"});
    }
    
    const token = jwt.sign({email:user.email},"jwtkey",{expiresIn:"4h"});
    res.cookie("token",token);
    res.status(200).json({status:true,message:"loggin Sucessfull",token});
})

userRouter.post("/apply",authentication,async(req,res)=>{
    try {

        const {oppertunity} = req.body;
        const newAppliedOppurtunity = new appliedOppertunity({
            userId: req.user.email,
            id: oppertunity.id,  // Store the internship ID
            profile_name: oppertunity.title,
            company_name: oppertunity.company,
            duration: oppertunity.duration
        })
        await newAppliedOppurtunity.save();
        res.status(201).json({status:true,message:"Oppurtunity applied sucessfully"})
    } catch (error) {
     
        return res.status(500).json({status:false,message:"Internal server error"});
    }

})

userRouter.get("/applied",authentication,async(req,res)=>{
    try {
        const appliedOppertunities = await appliedOppertunity.find({userId:req.user.email});
        return res.json(appliedOppertunities);

    } catch (error) {
        return res.status(400).json({status:false,message:"bad request"});
    }
})

userRouter.get("/verify",authentication,async(req,res)=>{
    try {
        if(!req.user){
            return res.status(401).json({status:false,message:"User not authorized"})
        }

        return res.status(200).json({status:true,message:"User Authenticate"});
    } catch (error) {
        return res.status(400).json({status:false,message:"bad Request"})
    }
})

userRouter.get("/logout",(req,res)=>{
    res.clearCookie("token");
    return res.json({status:true,message:"Logout Sucessfully"})
})

module.exports = userRouter;