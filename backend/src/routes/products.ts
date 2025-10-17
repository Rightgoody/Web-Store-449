import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router: Router = Router();

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

export default router;
