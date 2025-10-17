import { pool } from '../config/database';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface CartItemWithProduct extends CartItem {
  product_name: string;
  product_price: number;
  product_image_url: string;
  total_price: number;
}

export interface AddToCartData {
  user_id: number;
  product_id: number;
  quantity: number;
}

export class CartModel {
  static async findByUserId(userId: number): Promise<CartItemWithProduct[]> {
    const query = `
      SELECT 
        c.id,
        c.user_id,
        c.product_id,
        c.quantity,
        c.created_at,
        c.updated_at,
        p.name as product_name,
        p.price as product_price,
        p.image_url as product_image_url,
        (c.quantity * p.price) as total_price
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async addItem(cartData: AddToCartData): Promise<CartItem> {
    const { user_id, product_id, quantity } = cartData;
    
    // Check if item already exists in cart
    const existingItem = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update existing item quantity
      const query = `
        UPDATE cart_items 
        SET quantity = quantity + $1, updated_at = NOW()
        WHERE user_id = $2 AND product_id = $3
        RETURNING *
      `;
      const result = await pool.query(query, [quantity, user_id, product_id]);
      return result.rows[0];
    } else {
      // Add new item to cart
      const query = `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await pool.query(query, [user_id, product_id, quantity]);
      return result.rows[0];
    }
  }

  static async updateQuantity(userId: number, productId: number, quantity: number): Promise<CartItem | null> {
    if (quantity <= 0) {
      // Remove item from cart if quantity is 0 or negative
      await this.removeItem(userId, productId);
      return null;
    }

    const query = `
      UPDATE cart_items 
      SET quantity = $1, updated_at = NOW()
      WHERE user_id = $2 AND product_id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [quantity, userId, productId]);
    return result.rows[0] || null;
  }

  static async removeItem(userId: number, productId: number): Promise<void> {
    const query = 'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2';
    await pool.query(query, [userId, productId]);
  }

  static async clearCart(userId: number): Promise<void> {
    const query = 'DELETE FROM cart_items WHERE user_id = $1';
    await pool.query(query, [userId]);
  }
}
