import Product from "../../models/product.model.js";

export const getFilteredProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log('error in getting filtered products', error.message);
        res.status(500).json({ success: false, message: 'some error occured' });
    }
}