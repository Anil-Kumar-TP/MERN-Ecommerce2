import express from 'express';
const router = express.Router();
import { registerUser } from '../controllers/auth.controller.js'

router.post('/register', registerUser);

export default router;