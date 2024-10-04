import express from 'express';
import { upload } from '../../helpers/Cloudinary.js';
import { handleImageUpload } from '../../controllers/admin/products.controller.js';
const router = express.Router();

router.post('/upload-image', upload.single('my_file'), handleImageUpload);

export default router;