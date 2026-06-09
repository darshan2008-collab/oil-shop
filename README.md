# Swasthya Pure Cooking Oils - E-commerce Website

A complete e-commerce website for Swasthya Pure Cooking Oils with ordering system and admin panel.

## Features

### Customer Features
- **Homepage**: Modern design with hero section, product showcase, and feature highlights
- **Shop Page**: Browse and view all oil products with add to cart functionality
- **Shopping Cart**: Add/remove items, update quantities, view total
- **Checkout**: Complete order form with customer details and payment options
- **Order Success**: Confirmation page after successful order placement

### Admin Features
- **Admin Login**: Secure login with credentials (admin/admin123)
- **Dashboard**: Overview with order statistics (total, pending, processing, delivered, revenue)
- **Order Management**: View all orders, filter by status, update order status, delete orders
- **Order Details**: View detailed order information including customer details and items

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router DOM
- Lucide React (icons)
- Axios (API calls)

### Backend
- Node.js
- Express.js
- CORS
- Body Parser
- JSON file storage (orders and products)

## Project Structure

```
oil/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── Admin.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── data/
│   │   ├── orders.json
│   │   └── products.json
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. Navigate to the project directory:
```bash
cd oil
```

2. Install all dependencies (root, frontend, and backend):
```bash
npm run install:all
```

Or install manually:
```bash
npm install
cd frontend
npm install
cd ../backend
npm install
```

## Running the Application

### Option 1: Run both frontend and backend together
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

### Option 2: Run separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Usage

### Customer Flow
1. Open http://localhost:3000 in your browser
2. Browse products on the homepage or go to Shop
3. Add products to cart
4. View cart and proceed to checkout
5. Fill in customer details and place order
6. Receive order confirmation

### Admin Flow
1. Navigate to http://localhost:3000/admin/login
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`
3. View dashboard with order statistics
4. Manage orders:
   - View all orders
   - Filter by status (pending, processing, delivered, cancelled)
   - Update order status
   - Delete orders
   - View order details

## API Endpoints

### Products
- `GET /api/products` - Get all products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Products

The following products are available:
1. Sunflower Oil - ₹450/liter
2. Groundnut Oil - ₹380/liter
3. Sesame Oil - ₹520/liter
4. Coconut Oil - ₹400/liter
5. Castor Oil - ₹350/liter

## Data Storage

Orders and products are stored in JSON files in the `backend/data/` directory:
- `orders.json` - All customer orders
- `products.json` - Product catalog

## Customization

### Adding New Products
Edit `backend/data/products.json` to add new products:
```json
{
  "id": 6,
  "name": "New Oil",
  "price": 500,
  "description": "Description here",
  "image": "/images/new-oil.jpg",
  "category": "cooking"
}
```

### Changing Admin Credentials
Edit `frontend/src/pages/AdminLogin.jsx` to change login credentials:
```javascript
if (credentials.username === 'your_username' && credentials.password === 'your_password') {
```

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

### Backend
The backend is already production-ready. Just ensure Node.js is installed on your server.

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use, you can change them in:
- Frontend: `frontend/vite.config.js`
- Backend: `backend/server.js`

### CORS Issues
Ensure the backend CORS configuration allows requests from your frontend URL.

### Data Not Persisting
Check that the `backend/data/` directory exists and has write permissions.

## License

This project is for demonstration purposes.

## Support

For issues or questions, please contact the development team.
