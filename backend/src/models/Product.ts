import { pool } from '../config/database';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  created_at: Date;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

export class ProductModel {
  static async findAll(): Promise<Product[]> {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: number): Promise<Product | null> {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create(productData: CreateProductData): Promise<Product> {
    const { name, description, price, image_url, category, stock } = productData;
    
    const query = `
      INSERT INTO products (name, description, price, image_url, category, stock)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, description, price, image_url, category, stock]);
    return result.rows[0];
  }
}
