import express  from 'express'
const router = express.Router();
import multer from 'multer';
import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import userController from '../controllers/userControllers.js'

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

const upload = multer({ storage });

router.post('/login',userController.login)
router.post('/register',upload.single('file'),userController.register)

export default router