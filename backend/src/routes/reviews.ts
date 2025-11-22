import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all reviews for a product (public)
router.get('/product/:productId', ReviewController.getReviewsByProduct);

// Create, update, delete reviews (require authentication)
router.post('/product/:productId', authenticateToken, ReviewController.createReview);
router.put('/:id', authenticateToken, ReviewController.updateReview);
router.delete('/:id', authenticateToken, ReviewController.deleteReview);

export default router;

