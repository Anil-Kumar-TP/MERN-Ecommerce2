import paypal from "../../helpers/PayPal.js";
import Cart from "../../models/cart.model.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";

export const createOrder = async (req, res) => {
    try {
        const { userId, cartId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId } = req.body;

        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method:'paypal'
            },
            redirect_urls: {
                return_url:'http://localhost:5173/shop/paypal-return',
                cancel_url:'http://localhost:5173/shop/paypal-cancel',
            },
            transactions: [
                {
                    item_list: {
                        items: cartItems.map(item => ({
                            name: item.title,
                            sku: item.productId,
                            price: item.price.toFixed(2),
                            currency: 'USD',
                            quantity:item.quantity,
                        }))
                    },
                    amount: {
                        currency: 'USD',
                        total:totalAmount.toFixed(2),
                    },
                    description:'description'
                }
            ]
        }
        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'error while creating payment' });
            } else {
                const newlyCreatedOrder = new Order({ userId, cartId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId });
                await newlyCreatedOrder.save();

                const approvalURL = paymentInfo.links.find(link => link.rel === 'approval_url').href;
                res.status(201).json({ success: true, approvalURL, orderId: newlyCreatedOrder._id });
            }
        })
    } catch (error) {
        console.log('error in createOrder controller');
        res.status(500).json({ success: false, message: 'some error occured' });
    }
}

export const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;
        let order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'order not found' });
        }

        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentId = paymentId;
        order.payerId = payerId;

        for (let item of order.cartItems) { // once the payment is successful we need to reduce the stocks 
            let product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ success: false, message: `not enough stock for this product ${product.title}` });
            }

            product.totalStock -= item.quantity
            await product.save();
        }

        const getCartId = order.cartId;

        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        res.status(200).json({ success: true, message: 'order confirmed', data: order });
        
    } catch (error) {
        console.log('error in capturePayment controller');
        res.status(500).json({ success: false, message: 'some error occured' });
    }
}

export const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId });
        if (!orders.length) {
            return res.status(404).json({ success: false, message: 'no orders found' });
        }
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.log('error in getAllOrdersByUser controller', error.message);
        res.status(500).json({ success: true, message: 'error occured' });
    }
}

export const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params; //id of particular order
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
       console.log('error in getAllOrderDetails controller', error.message);
        res.status(500).json({ success: true, message: 'error occured' }); 
    }
}