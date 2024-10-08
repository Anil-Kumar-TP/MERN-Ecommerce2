import express from 'express'
import { addToCart, deleteCartItem, fetchCartItems, updateCartItemQuantity } from '../../controllers/shop/cart.controller.js';
const router = express.Router();

router.post('/add', addToCart);
router.get('/get/:userId', fetchCartItems);
router.put('/update-cart', updateCartItemQuantity);
router.delete('/:userId/:productId', deleteCartItem);


export default router;