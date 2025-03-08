import express  from 'express'
const router = express.Router();
import productControllers from '../controllers/productControllers.js';
import multer from 'multer';
import path from 'path'


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
const upload = multer({ storage });

router.get('/', productControllers.getProductBySort)

router.get('/getall', productControllers.getProducts)

router.post('/user',productControllers.getProductsByUser)

router.get('/search', productControllers.searchProduct)

router.put('/update',upload.array('images'),productControllers.updateProduct)

router.delete('/delete/:id',productControllers.deleteProduct)

router.get('/getproduct/:id', productControllers.getProductById)

router.post('/create',upload.array('images'), productControllers.createProduct)

export default router