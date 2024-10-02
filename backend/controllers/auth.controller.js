import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ userName, email, password: hashPassword });
        await newUser.save();
        res.status(200).json({ success: true, message: 'registration successful' });
    } catch (error) {
        console.log('error in register controller',error.message);
        res.status(500).json({ success: false, message: 'some error occured' });
    }
}

export const login = async (req, res) => {
    try {
        
    } catch (error) {
       console.log('error in login controller',error.message);
        res.status(500).json({ success: false, message: 'some error occured' }); 
    }
}