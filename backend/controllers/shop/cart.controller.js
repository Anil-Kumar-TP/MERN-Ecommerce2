import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || quantity <= 0) {
           return res.status(400).json({ success: false, message: 'invalid data provided' });
        }
        const product = await Product.findById(productId); // no product in db to add to cart
        if (!product) {
            return res.status(404).json({ success: false, message: 'product not found' });
        }
        let cart = await Cart.findOne({ userId }); //find the cart of the particular user
        if (!cart) {
            cart = new Cart({ userId, items: [] });// at first we will have an empty cart
        }
        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (findCurrentProductIndex === -1) {
            cart.items.push({ productId, quantity });
        } else {
            cart.items[findCurrentProductIndex].quantity += quantity;
        }
        await cart.save();
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.log('error in addToCart controller', error.message);
        res.status(500).json({ success: false, message: 'error occured in adding' });
    }
}


export const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'userid required' });
        }
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: "image title price salePrice"
        });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'cart not found for this user' });
        }

        const validItems = cart.items.filter(productItem => productItem.productId);
        if (validItems.length < cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }
        const populateCartItems = validItems.map(item => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            quantity: item.quantity
        }));

        res.status(200).json({ success: true, data: { ...cart._doc, items: populateCartItems } });
    } catch (error) {
        console.log('error in fetchCartItems controller', error.message);
        res.status(500).json({ success: false, message: 'error in fetching from cart' });
    }
}

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || quantity <= 0) {
           return res.status(400).json({ success: false, message: 'invalid data provided' });
        }
        const cart = await Cart.findOne({ userId });
         if (!cart) {
            return res.status(404).json({ success: false, message: 'cart not found for this user' });
        }
         
        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (findCurrentProductIndex === -1) {
            return res.status(404).json({ success: false, message: 'cart item not present' });
        }
        cart.items[findCurrentProductIndex].quantity = quantity;
        await cart.save();
        await cart.populate({
            path: 'items.productId',
            select: "image title price salePrice"
        });

        const populateCartItems = cart.items.map(item => ({
        productId: item.productId ? item.productId._id : null,
        image: item.productId ? item.productId.image : null,
        title: item.productId ? item.productId.title : 'product not found',
        price: item.productId ? item.productId.price : null,
        salePrice:item.productId ? item.productId.salePrice : null,
        quantity: item.quantity
        }));
        res.status(200).json({ success: true, data: { ...cart._doc, items: populateCartItems } });
    } catch (error) {
        console.log('error in updateCartItemsQuantity controller', error.message);
        res.status(500).json({ success: false, message: 'error in updating cart' }); 
    }
}

export const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
         if (!userId || !productId ) {
           return res.status(400).json({ success: false, message: 'invalid data provided' });
        }
        const cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            select: "image title price salePrice",
        });
         if (!cart) {
            return res.status(404).json({ success: false, message: 'cart not found for this user' });
        }
        cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);
        await cart.save();
        await cart.populate({
            path: "items.productId",
            select: "image title price salePrice"
        });
        const populateCartItems = cart.items.map(item => ({
        productId: item.productId ? item.productId._id : null,
        image: item.productId ? item.productId.image : null,
        title: item.productId ? item.productId.title : 'product not found',
        price: item.productId ? item.productId.price : null,
        salePrice:item.productId ? item.productId.salePrice : null,
        quantity: item.quantity
        }));
        res.status(200).json({ success: true, data: { ...cart._doc, items: populateCartItems } });
    } catch (error) {
        console.log('error in deleteCartItem controller', error.message);
        res.status(500).json({ success: false, message: 'error in deleting from cart' });
    }
}