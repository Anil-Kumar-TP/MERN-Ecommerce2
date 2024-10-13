import Order from "../../models/order.model.js";

export const getAllOrdersOfAllUsers = async (req, res) => {
    try {
        const orders = await Order.find({}); // all the orders for admin . in shop only for that user.
        if (!orders.length) {
            return res.status(404).json({ success: false, message: 'no orders found' });
        }
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.log('error in getAllOrdersOfAllUsers controller', error.message);
        res.status(500).json({ success: true, message: 'error occured' });
    }
}

export const getOrderDetailsForAdmin = async (req, res) => {
    try {
        const { id } = req.params; //same for both admin and shop
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

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params; //order id
        const { orderStatus } = req.body;
         const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'order not found' });
        }
        await Order.findByIdAndUpdate(id, { orderStatus });
        res.status(200).json({ success: true, message: 'order status updated successfully' });
    } catch (error) {
        console.log('error in updateOrderStatus controller', error.message);
        res.status(500).json({ success: true, message: 'error occured' });  
    }
}