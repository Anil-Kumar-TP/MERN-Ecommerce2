import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.route.js'
import adminProductsRoutes from './routes/admin/products.route.js'
import shopProductsRoutes from './routes/shop/products.route.js'
import shopCartRoutes from './routes/shop/cart.route.js'
import shopAddressRoutes from './routes/shop/address.route.js'
import shopOrderRoutes from './routes/shop/order.route.js'
import adminOrderRoutes from './routes/admin/order.route.js'
import shopSearchRoutes from './routes/shop/search.route.js'
import shopReviewRoutes from './routes/shop/review.route.js'
import commonFeatureRoutes from './routes/common/feature.route.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_BASE_URL,
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
app.use('/api/shop/address', shopAddressRoutes);
app.use('/api/shop/order', shopOrderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/shop/search', shopSearchRoutes);
app.use('/api/shop/review', shopReviewRoutes);
app.use('/api/common/feature', commonFeatureRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('server started at http://localhost:' + PORT);
});
