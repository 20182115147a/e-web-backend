import express  from 'express'
const router = express.Router();
import productControllers from '../controllers/productControllers.js';
import multer from 'multer';

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dinpdsnlv', 
  api_key: '756175383215195',       
  api_secret: 'SWlTZaBrIznYwEOsRKq1bRIvh9I'  
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads'
  },
});
const upload = multer({ storage: storage });
router.get('/', productControllers.getProductBySort)

router.get('/getall', productControllers.getProducts)

router.post('/user',productControllers.getProductsByUser)

router.get('/search', productControllers.searchProduct)

router.put('/update',upload.array('images'),productControllers.updateProduct)

router.delete('/delete/:id',productControllers.deleteProduct)

router.get('/getproduct/:id', productControllers.getProductById)

router.post('/create',upload.array('images'), productControllers.createProduct)

export default router