import User from "../models/user.login.model.js";
import bcrypt from "bcrypt";

export const signup=async(req,res)=>{
    try{
        const {name,username,password,confirmPassword}=req.body;

        if(password!==confirmPassword){
            return res.status(400).json({msg:"Password does not match"});
        }
        const user=await User.findOne({username});

        if(user){
            return res.status(400).json({error:"username aldready exists"})
        }

        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt)
        const newUser=new User({name,username,password:hashedpassword});
        
        await newUser.save();
    res.status(201).json({ msg: 'User registered successfully' });

    }
    catch(error){
        console.log("Error in signup controller",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const login=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await User.findOne({username});

        const isPasswordCorrect =await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username and password"})

        }
        res.status(200).json({ msg: 'Login successful' });
    }
        catch(error){
            console.log("Error in login controller",error.message);
            res.status(500).json({error:"Internal Server Error"})
        }
    
    }