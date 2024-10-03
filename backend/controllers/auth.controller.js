import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) return res.json({ success: false, message: 'user already exist with the same email' });
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ userName, email, password: hashPassword });
        await newUser.save();
        res.status(200).json({ success: true, message: 'registration successful' });
    } catch (error) {
        console.log('error in register controller',error.message);
        res.status(500).json({ success: false, message: 'some error occured' });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) return res.json({ success: false, message: 'no user found.register first!' });
        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if (!checkPasswordMatch) return res.json({ success: false, message: 'invalid password' });
        const token = jwt.sign({ id: checkUser._id, role: checkUser.role, email: checkUser.email }, 'CLIENT_SECRET_KEY', {
            expiresIn:'60m'
        });
        res.cookie('token', token, { httpOnly: true, secure: false }).json({
            success: true, message: 'logged in successfully',
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id:checkUser._id,
         }});
    } catch (error) {
       console.log('error in login controller',error.message);
        res.status(500).json({ success: false, message: 'some error occured' }); 
    }
}