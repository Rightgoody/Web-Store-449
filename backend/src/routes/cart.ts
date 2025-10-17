import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';

const router: Router = Router();

// All cart routes require authentication
router.use(authenticateToken);

router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.put('/update/:product_id', CartController.updateCartItem);
router.delete('/remove/:product_id', CartController.removeFromCart);
router.delete('/clear', CartController.clearCart);

export default router;
