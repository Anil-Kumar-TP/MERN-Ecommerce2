import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.route.js'
import adminProductsRoutes from './routes/admin/products.route.js'
import shopProductsRoutes from './routes/shop/products.route.js'
import shopCartRoutes from './routes/shop/cart.route.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/admin/products', adminProductsRoutes);
app.use('/api/shop/products', shopProductsRoutes);
app.use('/api/shop/cart', shopCartRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log('server started at http://localhost:' + PORT);
});
