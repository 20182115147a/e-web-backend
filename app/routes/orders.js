import express  from 'express'
const router = express.Router();
import orderControllers from '../controllers/orderControllers.js';




router.post('/', orderControllers.checkout)
router.get('/:userId', orderControllers.getOrder)

export default router