import User from "../models/user.login.model.js";
import jwt from 'jsonwebtoken'; 
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const signup = async (req, res) => {
    try {
        const { name, username, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Password does not match" });
        }

        // Check if user already exists
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ name, username, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "Invalid username" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Password is incorrect" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict" });

        // Ensure userId is included in the response
        res.status(200).json({ msg: 'Login successful', token, userId: user._id ,role:user.role ,username:user.username});
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const adminSignup = async(req,res)=>{
    const { name, username, password, adminToken } = req.body;

    if (!name || !username || !password || !adminToken) {
        return res.status(400).json({ error: 'Name, username, password, and adminToken are required' });
    }

    // Check if the provided admin token matches the required token
    if (adminToken !== process.env.ADMIN_SIGNUP_TOKEN) {
        return res.status(403).json({ error: 'Invalid token' });
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username }).exec();
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new admin user
        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            role: 'admin',
        });

        await newUser.save();
        res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ msg: 'Logout successful' });
};


export const checkSession = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
            return res.status(401).json({ error: "Token expired or invalid" });
        }
        res.status(200).json({ msg: 'Session is valid' });
    });
};

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401); // If no token, return 401

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // If invalid token, return 403
        req.user = user;
        next();
    });
};


export const validatePassword=async(req,res)=>{
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Password validated successfully' });
    } catch (error) {
        console.error('Error validating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const getAllUsers=async(req,res)=>{
    
}