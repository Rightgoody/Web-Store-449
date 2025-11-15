import { Request, Response } from 'express';
import { CartModel } from '../models/Cart';
import { AuthRequest } from '../middleware/auth';

export class CartController {
  static async getCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const cartItems = await CartModel.findByUserId(userId);
      
      // Ensure total_price is converted to number before summing
      const total = cartItems.reduce((sum, item) => {
        const price = typeof item.total_price === 'string' 
          ? parseFloat(item.total_price) 
          : Number(item.total_price);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
      
      res.json({
        items: cartItems,
        total: total.toFixed(2)
      });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async addToCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { product_id, quantity } = req.body;

      if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Valid product_id and quantity are required' });
      }

      const cartItem = await CartModel.addItem({
        user_id: userId,
        product_id,
        quantity
      });

      res.status(201).json({
        message: 'Item added to cart successfully',
        cartItem
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateCartItem(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { product_id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 0) {
        return res.status(400).json({ error: 'Valid quantity is required' });
      }

      const cartItem = await CartModel.updateQuantity(
        userId,
        parseInt(product_id),
        quantity
      );

      if (!cartItem) {
        return res.json({ message: 'Item removed from cart' });
      }

      res.json({
        message: 'Cart item updated successfully',
        cartItem
      });
    } catch (error) {
      console.error('Update cart item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async removeFromCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { product_id } = req.params;

      await CartModel.removeItem(userId, parseInt(product_id));

      res.json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async clearCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      await CartModel.clearCart(userId);

      res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
