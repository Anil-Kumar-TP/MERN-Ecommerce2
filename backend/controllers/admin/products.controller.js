import { imageUploadUtil } from "../../helpers/Cloudinary.js";
import Product from "../../models/product.model.js";

export const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url); 
        res.json({ success: true, result });
    } catch (error) {
        console.log('error in image upload controller', error.message);
        res.json({ success: false, message: 'error occured' });
    }
}

export const addProduct = async (req, res) => {
    try {
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
        const newlyCreatedProduct = new Product({ image, title, description, category, brand, price, salePrice, totalStock });
        await newlyCreatedProduct.save();
        res.status(201).json({ success: true, data: newlyCreatedProduct });
    } catch (error) {
        console.log('error in addProduct controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' });
    }
}


export const fetchAllProducts = async (req, res) => {
    try {
        const listOfProducts = await Product.find({});
        res.status(200).json({ success: true, data: listOfProducts });
    } catch (error) {
        console.log('error in fetchAllProducts controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' });
    }
}

export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
        let findProduct = await Product.findById(id);
        if (!findProduct) return res.status(404).json({ success: false, message: 'product not found' });
        findProduct.title = title || findProduct.title; // either entering title or previous one itself
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price === '' ? 0 : price || findProduct.price;
        findProduct.salePrice = salePrice === '' ? 0 : salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;
        findProduct.image = image || findProduct.image;
        await findProduct.save();
        res.status(200).json({ success: true, data: findProduct });
    } catch (error) {
        console.log('error in fetchAllProducts controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ success: false, message: 'product not found' });
        res.status(200).json({ success: true, message: 'product deleted successfully' });
    } catch (error) {
       console.log('error in fetchAllProducts controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' }); 
    }
}