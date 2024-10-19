const express=require('express');
const User=require('./../models/user');
const router=express.Router();
const {jwtAuthMiddleWare, generateToken}= require('./../JWT');

router.post('/signup',async (req,res)=>{
    try{
        const data=req.body;  // Assuming the request data contains the user data
        
        // const newUser=new User(data); // create a new user document using Mongoose model
        const newUser=new User(data);

        // Save the new user to the databae
        const response = await newUser.save();

        console.log("Data Saved");

        const Payload={
            id:response.id
        }

        console.log(JSON.stringify(Payload));
        const token=generateToken(Payload);
        console.log("Token is: ",token);

        res.status(200).json({response: response, token: token});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.post('/login',async (req,res)=>{
    try{
        const {aadhar,password}=req.body;

        const user=await User.findOne({aadhar:aadhar});

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        const Payload={
            id:user.id
        }

        const token=generateToken(Payload);

        res.json({token})
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.get('/profile',jwtAuthMiddleWare,async (req,res)=>{
    try{
        const userData=req.user;

        const userID=userData.id;
        const user=await User.findById(userID);

        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server error"});
    }
})

router.put('/profile/password',jwtAuthMiddleWare,async (req,res)=>{
    try{
        const userID=req.user.id; // extract id from the token

        const {currentPassword,newPassword}=req.body; // extract current and new password from request body

        // check if user is present
        const user=await User.findById(userID);

        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        user.password=newPassword;
        await user.save();

        console.log('Password updated!');
        res.status(200).json({message: 'Password updated'});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server error"});
    }
})

module.exports=router;