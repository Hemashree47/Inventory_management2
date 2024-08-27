import jwt from 'jsonwebtoken';
import User from '../models/user.login.model'
import { sendMail } from './mail.controller';

// Middleware to verify JWT token and extract user info
export const verifyUser = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.userId = decoded.id;
        next();
    });
};

// Middleware to check if user exists
export const checkUserExists = async (req, res, next) => {
    const user = await User.findById(req.userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
};


