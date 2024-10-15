import Feature from "../../models/feature.model.js";

export const addFeatureImage = async (req, res) => {
    try {
        const { image } = req.body;
        const featuredImages = new Feature({ image });
        await featuredImages.save();
        res.status(201).json({ success: true, data: featuredImages });
    } catch (error) {
        console.log('error in addFeatureImage controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' });
    }
}

export const getFeatureImages = async (req, res) => {
    try {
        const images = await Feature.find({});
        res.status(200).json({ success: true, data: images });
    } catch (error) {
        console.log('error in addFeatureImage controller', error.message);
        res.status(500).json({ success: false, message: 'error occured' });
    }
}