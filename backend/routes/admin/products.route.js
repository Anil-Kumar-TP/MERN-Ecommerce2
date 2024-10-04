import express from 'express';
import { upload } from '../../helpers/Cloudinary.js';
import { addProduct, deleteProduct, editProduct, fetchAllProducts, handleImageUpload } from '../../controllers/admin/products.controller.js';
const router = express.Router();

router.post('/upload-image', upload.single('my_file'), handleImageUpload);
router.post('/add', addProduct);
router.get('/get', fetchAllProducts);
router.put('/edit/:id', editProduct);
router.delete('/delete/:id', deleteProduct);


export default router;