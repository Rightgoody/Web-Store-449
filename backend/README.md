# Web Store Backend API

A simple Node.js + Express + PostgreSQL backend for the Web Store 449 project.

## Features

- User authentication (register/login) with JWT
- Product management
- Shopping cart functionality
- PostgreSQL database
- TypeScript support

## Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webstore_449
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
```

4. Create the database:
```sql
CREATE DATABASE webstore_449;
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Cart (requires authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:product_id` - Update cart item quantity
- `DELETE /api/cart/remove/:product_id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

## Database Schema

### Users
- id, email, password_hash, name, created_at

### Products
- id, name, description, price, image_url, category, stock, created_at

### Cart Items
- id, user_id, product_id, quantity, created_at, updated_at

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations

## Environment Variables

- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time
- `PORT` - Server port
- `FRONTEND_URL` - Frontend URL for CORS
