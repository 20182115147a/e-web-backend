import express  from 'express'
const router = express.Router();
import multer from 'multer';
import path from 'path'
import userController from '../controllers/userControllers.js'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
const upload = multer({ storage });

router.post('/login',userController.login)
router.post('/register',upload.single('file'),userController.register)

export default router