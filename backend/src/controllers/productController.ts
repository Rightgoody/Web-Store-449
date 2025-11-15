import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductModel.findAll();
      
      res.json(products); 

    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(parseInt(id));

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);

    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}