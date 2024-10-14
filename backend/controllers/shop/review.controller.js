import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import ProductReview from "../../models/review.model.js";

export const addProductReview = async (req, res) => {
    try {
        const { productId, userId, userName, reviewMessage, reviewValue } = req.body;
        const order = await Order.findOne({ userId, 'cartItems.productId': productId, orderStatus: 'confirmed' });
        if (!order) {
            return res.status(403).json({ success: false, message: 'you need to purchase product to review it!' });
        }
        const checkExistingReview = await ProductReview.findOne({ productId, userId });
        if (checkExistingReview) {
            return res.status(400).json({ success: false, message: 'you already reviewed this product!' });
        }
        const newReview = new ProductReview({ productId, userId, userName, reviewMessage, reviewValue });
        await newReview.save();

        const reviews = await ProductReview.find({ productId });
        const totalReviewsLength = reviews.length;
        const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength;
        await Product.findByIdAndUpdate(productId, { averageReview });
        res.status(201).json({ success: true, data: newReview });
        
    } catch (error) {
        console.log('error in addProductReview controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' });
    }
}
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await ProductReview.find({ productId });
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
       console.log('error in getProductReviews controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' }); 
    }
}