import { Request, Response } from 'express';
import { ReviewModel } from '../models/Review';
import { AuthRequest } from '../middleware/auth';

export class ReviewController {
  static async getReviewsByProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const reviews = await ReviewModel.findByProductId(parseInt(productId));
      res.json(reviews);
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createReview(req: AuthRequest, res: Response) {
    try {
      const { productId } = req.params;
      const { rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const review = await ReviewModel.create({
        user_id: req.user.id,
        product_id: parseInt(productId),
        rating,
        comment: comment || null,
      });

      res.status(201).json(review);
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateReview(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const review = await ReviewModel.update(parseInt(id), req.user.id, {
        rating,
        comment,
      });

      if (!review) {
        return res.status(404).json({ error: 'Review not found or unauthorized' });
      }

      res.json(review);
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteReview(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const deleted = await ReviewModel.delete(parseInt(id), req.user.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Review not found or unauthorized' });
      }

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

