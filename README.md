# Web Store 449

A complete full-stack TypeScript-based e-commerce website with user authentication, shopping cart functionality, PostgreSQL database integration, and Docker containerization for easy deployment.

## Features

### Frontend
- **Modern, responsive design** with beautiful UI/UX
- **TypeScript-based** frontend with Vite for fast development
- **Complete authentication system** - login/register with JWT
- **Shopping cart functionality** with persistent storage
- **Product catalog** with dynamic loading
- **Clean, professional styling** with modern CSS3 features
- **Mobile-friendly layout** with responsive design
- **Single Page Application** with client-side routing

### Backend
- **Node.js + Express + TypeScript** for robust server-side development
- **PostgreSQL database** with Docker containerization
- **JWT authentication** with secure token management
- **RESTful API endpoints** for all operations
- **Shopping cart management** with database persistence
- **User management** with password hashing
- **Database migrations** for easy setup
- **CORS protection** and input validation

### DevOps & Deployment
- **Docker containerization** for PostgreSQL database
- **Automated setup scripts** for one-command deployment
- **Environment configuration** with .env files
- **Database seeding** with sample products
- **Process management** with automatic cleanup

## Project Structure

```
Web-Store-449/
├── src/                         # Frontend application
│   ├── main.ts                  # Application entry point with routing
│   ├── pages/                   # Page components
│   │   ├── HomePage.ts          # Landing page with hero section
│   │   ├── AboutPage.ts         # About us page with company info
│   │   ├── StorePage.ts         # Product catalog with shopping
│   │   └── LoginPage.ts         # Authentication page (login/register)
│   ├── components/              # Reusable components (future)
│   └── styles/
│       └── main.css            # Complete stylesheet with auth styling
├── backend/                     # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts      # PostgreSQL connection with Docker
│   │   ├── models/
│   │   │   ├── User.ts         # User model with bcrypt auth
│   │   │   ├── Product.ts      # Product model with CRUD
│   │   │   └── Cart.ts         # Shopping cart with relationships
│   │   ├── controllers/
│   │   │   ├── authController.ts    # JWT login/register logic
│   │   │   ├── cartController.ts    # Cart CRUD operations
│   │   │   └── productController.ts # Product management
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.ts          # Authentication endpoints
│   │   │   ├── products.ts      # Product API endpoints
│   │   │   └── cart.ts          # Cart API endpoints
│   │   ├── scripts/
│   │   │   └── migrate.ts       # Database setup and seeding
│   │   └── app.ts               # Express server with CORS
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                     # Environment configuration
├── scripts/                     # Automation scripts
│   └── dev-setup.sh            # Complete development setup
├── docker-compose.yml          # PostgreSQL Docker configuration
├── start.sh                    # One-command startup script
├── stop.sh                     # Clean shutdown script
├── index.html                  # Main HTML file
├── package.json                # Frontend dependencies
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── LICENSE
└── README.md
```

## Tech Stack

### Frontend
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - No frameworks, pure JS/TS
- **CSS3** - Modern styling with flexbox/grid

### Backend
- **Node.js + Express** - Server framework
- **TypeScript** - Type-safe backend development
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **Docker** (for PostgreSQL database)
- **pnpm** (recommended) or **npm**

### Super Quick Start (One Command)

```bash
# Clone the repository
git clone <repository-url>
cd Web-Store-449

# Install dependencies and start everything
pnpm install && ./start.sh
```

The script will:
- Start PostgreSQL in Docker
- Install all dependencies
- Run database migrations
- Start backend server
- Start frontend development serve

### Alternative Setup Methods

#### Method 1: Automated Scripts
```bash
# First time setup (run once)
pnpm run dev:setup

# Start everything
pnpm run dev:full
```

#### Method 2: Manual Setup
```bash
# Start database
pnpm run db:start

# Start backend (in separate terminal)
cd backend && pnpm install && pnpm run dev

# Start frontend (in separate terminal)
pnpm run dev
```

## Development Commands

### Quick Commands
```bash
./start.sh          # Start everything (database + backend + frontend)
./stop.sh           # Stop everything and clean up
pnpm run dev:full   # Start everything using npm scripts
```

### Individual Services
```bash
# Frontend only
pnpm run dev

# Backend only  
pnpm run backend:dev

# Database only
pnpm run db:start    # Start database
pnpm run db:stop       # Stop database
pnpm run db:reset   # Reset database (removes all data)
```

### Setup & Maintenance
```bash
pnpm run dev:setup  # Complete first-time setup
pnpm run build      # Build for production
pnpm run preview    # Preview production build
```

## Authentication System

### User Features
- **User Registration** - Create new accounts with email/password
- **User Login** - Secure authentication with JWT tokens
- **User Profile** - Persistent user sessions
- **Logout** - Secure session termination
- **Password Security** - bcrypt hashing for password protection

### Authentication Flow
1. **Registration**: User creates account → Password hashed → JWT token generated
2. **Login**: Credentials validated → JWT token returned → Session established
3. **Protected Routes**: Token validated → Access granted/denied
4. **Logout**: Token invalidated → Session cleared

### API Endpoints
```typescript
POST /api/auth/register  // Create new user account
POST /api/auth/login     // Authenticate user
GET  /api/auth/profile   // Get user profile (requires auth)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/profile` - Get user profile (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Shopping Cart (requires authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:product_id` - Update cart item quantity
- `DELETE /api/cart/remove/:product_id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Health Check
- `GET /api/health` - API health status

## Database Schema

### Tables
- **users** - User accounts (id, email, password_hash, name, created_at)
- **products** - Store inventory (id, name, description, price, image_url, category, stock)
- **cart_items** - Shopping cart (id, user_id, product_id, quantity)
- **orders** - Order history (id, user_id, total_amount, status, created_at)
- **order_items** - Order line items (id, order_id, product_id, quantity, price)

### Database Features
- **Docker Containerization** - PostgreSQL running in Docker
- **Automatic Migrations** - Database setup with one command
- **Data Seeding** - Sample products loaded automatically
- **Foreign Key Relationships** - Proper database relationships
- **Connection Pooling** - Efficient database connections

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **CORS Protection** - Configured for frontend-backend communication
- **Input Validation** - Request validation and sanitization
- **Protected Routes** - Authentication required for sensitive operations
- **Token Expiration** - Automatic token expiration for security

## Customization

### Frontend
- **Store Branding** - Update store name in `index.html`
- **Styling** - Modify styles in `src/styles/main.css`
- **Pages** - Add new pages in `src/pages/`
- **Components** - Create reusable components in `src/components/`
- **Authentication** - Customize login page in `src/pages/LoginPage.ts`

### Backend
- **API Routes** - Add new endpoints in `src/routes/`
- **Models** - Extend database models in `src/models/`
- **Controllers** - Add business logic in `src/controllers/`
- **Middleware** - Add custom middleware in `src/middleware/`

## Deployment

### Frontend
```bash
pnpm run build      # Build for production
# Deploy the `dist/` folder to any static hosting service
```

### Backend
```bash
cd backend
pnpm run build      # Build for production
pnpm start          # Start production server
# Deploy to cloud platforms (Heroku, Railway, etc.)
```

### Docker Deployment
```bash
# Database is already containerized
docker compose up -d postgres

# Deploy backend and frontend to your preferred platform
```

## Environment Variables

### Backend (.env)
```env
# Database Configuration (Docker PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webstore_449
DB_USER=webstore_user
DB_PASSWORD=webstore_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Testing

### Manual Testing
1. **Start the application**: `./start.sh`
2. **Open browser**: `http://localhost:3000`
3. **Test registration**: Create a new account
4. **Test login**: Login with credentials
5. **Test navigation**: Browse different pages
6. **Test cart**: Add items to shopping cart

### API Testing
```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test products endpoint
curl http://localhost:3001/api/products

# Test authentication
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.