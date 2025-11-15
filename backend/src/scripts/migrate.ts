import { pool } from '../config/database';

export async function createTables() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(500),
        category VARCHAR(100),
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create cart_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

export async function seedProducts() {
  try {
    // Check if products already exist
    const existingProducts = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(existingProducts.rows[0].count) > 0) {
      console.log('Products already exist, skipping seed...');
      return;
    }

    // Insert sample products
    const products = [
      {
        name: 'Gildan T-Shirt',
        description: 'Comfortable cotton t-shirt perfect for everyday wear',
        price: 9.99,
        image_url: 'https://ik.imagekit.io/c2o/prd/ik-seo/tr:n-original/4/c/8/8/4c883b480180432520fb059a6b99cd8c5dec30b8_Gildan_Heavy_Cotton_Adult_TShirt_213_638/Gildan_Heavy_Cotton_Adult_TShirt_213_638.jpg',
        category: 'T-Shirts',
        stock: 50
      },
      {
        name: 'Gap Modern Khakis',
        description: 'Classic khaki pants with modern fit',
        price: 29.99,
        image_url: 'https://www.gap.com/webcontent/0055/633/889/cn55633889.jpg',
        category: 'Pants',
        stock: 25
      },
      {
        name: 'Hanes EcoSmart Sweatshirt',
        description: 'Eco-friendly sweatshirt made from recycled materials',
        price: 19.99,
        image_url: 'https://www.bigtopshirtshop.com/cdn/shop/files/P160_ash_flat_front_1000x1500.jpg?v=1734115633',
        category: 'Sweatshirts',
        stock: 30
      }
    ];

    for (const product of products) {
      await pool.query(`
        INSERT INTO products (name, description, price, image_url, category, stock)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [product.name, product.description, product.price, product.image_url, product.category, product.stock]);
    }

    console.log('Sample products inserted successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  (async () => {
    try {
      await createTables();
      await seedProducts();
      console.log('Database setup completed!');
      process.exit(0);
    } catch (error) {
      console.error('Database setup failed:', error);
      process.exit(1);
    }
  })();
}
