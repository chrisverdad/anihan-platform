# AniHan Backend API

Backend server for AniHan Platform using Express.js and SQLite.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- No database server required (SQLite is file-based)

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file (already created):
```
PORT=3000
JWT_SECRET=anihan_secret_key_2024
NODE_ENV=development
```

**Note:** The SQLite database file (`data/anihan.db`) will be created automatically when you run the seed script or start the server.

3. Seed the database with mock data:
```bash
npm run seed
```

5. Start the server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile
- `GET /api/v1/auth/users` - Get all users (Admin)
- `PUT /api/v1/auth/users/:id/status` - Update user status (Admin)
- `PUT /api/v1/auth/users/:id` - Update user (Admin)
- `DELETE /api/v1/auth/users/:id` - Delete user (Admin)

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Orders
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/:id` - Update order
- `DELETE /api/v1/orders/:id` - Delete order

### Waste Management
- `GET /api/v1/waste/types` - Get waste types
- `POST /api/v1/waste/types` - Create waste type
- `GET /api/v1/waste/categories` - Get waste categories
- `POST /api/v1/waste/categories` - Create waste category
- `PUT /api/v1/waste/categories/:id` - Update waste category
- `DELETE /api/v1/waste/categories/:id` - Delete waste category
- `GET /api/v1/waste/submissions` - Get waste submissions
- `POST /api/v1/waste/submissions` - Create waste submission
- `PUT /api/v1/waste/submissions/:id` - Update waste submission
- `DELETE /api/v1/waste/submissions/:id` - Delete waste submission
- `GET /api/v1/waste/source-submissions` - Get source waste submissions
- `POST /api/v1/waste/source-submissions` - Create source waste submission
- `PUT /api/v1/waste/source-submissions/:id` - Update source waste submission
- `DELETE /api/v1/waste/source-submissions/:id` - Delete source waste submission
- `GET /api/v1/waste/inventory` - Get inventory items
- `POST /api/v1/waste/inventory` - Create inventory item
- `PUT /api/v1/waste/inventory/:id` - Update inventory item
- `DELETE /api/v1/waste/inventory/:id` - Delete inventory item

### Health Check
- `GET /health` - Server health check

## Database Models

- **User** - Users (admin, vendor, user)
- **Product** - Products for sale
- **Order** - Customer orders
- **Delivery** - Delivery information
- **WasteType** - Types of waste
- **WasteCategory** - Categories of waste
- **WasteSubmission** - Waste submissions
- **SourceWasteSubmission** - Source waste submissions from vendors
- **InventoryItem** - Vendor inventory items

## Default Accounts

After seeding, you can login with:
- **Admin**: `admin@anihan.com` / `admin123`
- **Vendor**: `vendor@anihan.com` / `vendor123`
- **User**: `user@anihan.com` / `user123`

## Notes

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- The frontend will fallback to localStorage if the API is unavailable
- All data is seeded from mock data matching the frontend stores

