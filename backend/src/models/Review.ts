import { pool } from '../config/database';

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  created_at: Date;
  updated_at: Date;
  user_name?: string; // For joined queries
}

export interface CreateReviewData {
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
}

export class ReviewModel {
  static async findByProductId(productId: number): Promise<Review[]> {
    const query = `
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [productId]);
    return result.rows;
  }

  static async findById(id: number): Promise<Review | null> {
    const query = `
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create(reviewData: CreateReviewData): Promise<Review> {
    const { user_id, product_id, rating, comment } = reviewData;
    
    const query = `
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [user_id, product_id, rating, comment || null]);
    
    // Fetch with user name
    const review = await this.findById(result.rows[0].id);
    return review!;
  }

  static async update(id: number, userId: number, reviewData: Partial<CreateReviewData>): Promise<Review | null> {
    const { rating, comment } = reviewData;
    
    // First verify the review belongs to the user
    const existingReview = await pool.query(
      'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (existingReview.rows.length === 0) {
      return null;
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (rating !== undefined) {
      updates.push(`rating = $${paramCount++}`);
      values.push(rating);
    }
    if (comment !== undefined) {
      updates.push(`comment = $${paramCount++}`);
      values.push(comment);
    }
    
    if (updates.length === 0) {
      // No updates to make
      return await this.findById(id);
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, userId);

    const query = `
      UPDATE reviews
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  static async delete(id: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rowCount! > 0;
  }

  static async getAverageRating(productId: number): Promise<number> {
    const query = `
      SELECT COALESCE(AVG(rating), 0) as avg_rating
      FROM reviews
      WHERE product_id = $1
    `;
    const result = await pool.query(query, [productId]);
    return parseFloat(result.rows[0].avg_rating) || 0;
  }
}

