import Address from "../../models/address.model.js";

export const addAddress = async (req, res) => {
    try {
        const { userId, address, city, pincode, phone, notes } = req.body;
        if (!userId || !address || !city || !pincode || !phone || !notes) {
            return res.status(400).json({ success: false, message: 'invalid data' });
        }
        const newlyCreatedAddress = new Address({ userId, address, city, pincode, phone, notes });
        await newlyCreatedAddress.save();
        res.status(201).json({ success: true, data: newlyCreatedAddress });
    } catch (error) {
        console.log('error in addAddress controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' });
    }
}

export const fetchAllAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'userId is required' });
        }
        const addressList = await Address.find({ userId });
        res.status(200).json({ success: true, data: addressList });
    } catch (error) {
        console.log('error in fetchAllAddress controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' });
    }
}

export const editAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const formData = req.body;
        if (!userId || !addressId) {
           return res.status(400).json({ success: false, message: 'userId and addressId is required' });  
        }
        const address = await Address.findOneAndUpdate({ _id: addressId, userId }, formData, { new: true });
        if (!address) {
            return res.status(404).json({ success: false, message: 'address cannot be found' });
        }
        res.status(200).json({ success: true, data: address });
    } catch (error) {
        console.log('error in editAddress controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' });
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
         if (!userId || !addressId) {
           return res.status(400).json({ success: false, message: 'userId and addressId is required' });  
        }
        const address = await Address.findOneAndDelete({ _id: addressId, userId });
         if (!address) {
            return res.status(404).json({ success: false, message: 'address cannot be found' });
        }
        res.status(200).json({ success: true, message: 'address deleted successfully' });
    } catch (error) {
        console.log('error in deleteAddress controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' });
    }
}