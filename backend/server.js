const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Data files
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(REVIEWS_FILE)) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify([], null, 2));
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', port: PORT });
});

const translationMap = {
  'sunflower': 'சூரியகாந்தி எண்ணெய்',
  'groundnut': 'கடலை எண்ணெய்',
  'sesame': 'நல்லெண்ணெய்',
  'coconut': 'தேங்காய் எண்ணெய்',
  'castor': 'விளக்கெண்ணெய்',
  'mustard': 'கடுகு எண்ணெய்',
  'olive': 'ஆலிவ் எண்ணெய்',
  'neem': 'வேப்ப எண்ணெய்',
  'almond': 'பாதாம் எண்ணெய்',
  'gingelly': 'நல்லெண்ணெய்'
};

const translateName = (name) => {
  if (!name) return '';
  if (name.includes('(')) return name;

  const lower = name.toLowerCase();
  for (const [eng, tam] of Object.entries(translationMap)) {
    if (lower.includes(eng)) {
      return `${name} (${tam})`;
    }
  }
  return name;
};

if (!fs.existsSync(PRODUCTS_FILE)) {
  const initialProducts = [
    { id: 1, name: 'Sunflower Oil', tamilName: 'சூரியகாந்தி எண்ணெய்', price: 450, description: 'Rich in Vitamin E and good for heart health.', image: '/images/sunflower-oil.png', category: 'cooking' },
    { id: 2, name: 'Groundnut Oil', tamilName: 'கடலை எண்ணெய்', price: 380, description: 'Natural antioxidants and essential nutrients.', image: '/images/groundnut-oil.png', category: 'cooking' },
    { id: 3, name: 'Sesame Oil', tamilName: 'நல்லெண்ணெய்', price: 520, description: 'Good for bone health and increases immunity.', image: '/images/sesame-oil.png', category: 'cooking' },
    { id: 4, name: 'Coconut Oil', tamilName: 'தேங்காய் எண்ணெய்', price: 400, description: 'Boosts metabolism and supports healthy living.', image: '/images/coconut-oil.png', category: 'cooking' },
    { id: 5, name: 'Castor Oil', tamilName: 'விளக்கெண்ணெய்', price: 350, description: 'Good for hair, skin and overall wellness.', image: '/images/castor-oil.png', category: 'wellness' }
  ];
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2));
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  const translatedProducts = products.map(p => {
    const displayName = p.tamilName ? `${p.name} (${p.tamilName})` : translateName(p.name);
    return {
      ...p,
      name: displayName,
      englishName: p.name,
      tamilName: p.tamilName || ''
    };
  });
  res.json(translatedProducts);
});

// Add a new product
app.post('/api/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: req.body.name,
    tamilName: req.body.tamilName || '',
    price: parseInt(req.body.price),
    description: req.body.description,
    image: req.body.image, // Base64 data URL
    category: req.body.category || 'cooking'
  };
  products.push(newProduct);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  
  res.json({
    ...newProduct,
    name: newProduct.tamilName ? `${newProduct.name} (${newProduct.tamilName})` : translateName(newProduct.name),
    englishName: newProduct.name,
    tamilName: newProduct.tamilName || ''
  });
});

// Update a product
app.put('/api/products/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex !== -1) {
    products[productIndex] = {
      ...products[productIndex],
      name: req.body.name !== undefined ? req.body.name : products[productIndex].name,
      tamilName: req.body.tamilName !== undefined ? req.body.tamilName : (products[productIndex].tamilName || ''),
      price: req.body.price !== undefined ? parseInt(req.body.price) : products[productIndex].price,
      description: req.body.description !== undefined ? req.body.description : products[productIndex].description,
      image: req.body.image !== undefined ? req.body.image : products[productIndex].image,
      category: req.body.category !== undefined ? req.body.category : products[productIndex].category
    };
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    
    const updatedProduct = products[productIndex];
    res.json({
      ...updatedProduct,
      name: updatedProduct.tamilName ? `${updatedProduct.name} (${updatedProduct.tamilName})` : translateName(updatedProduct.name),
      englishName: updatedProduct.name,
      tamilName: updatedProduct.tamilName || ''
    });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.json({ message: 'Product deleted', product: deletedProduct[0] });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Create order
app.post('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  const newOrder = {
    id: orders.length + 1,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.push(newOrder);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  res.json(newOrder);
});

// Get all orders (admin)
app.get('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  res.json(orders);
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (orderIndex !== -1) {
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json(orders[orderIndex]);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json({ message: 'Order deleted' });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Reviews Endpoints
app.get('/api/reviews', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const { username, rating, comment } = req.body;
  if (!username || !rating || !comment) {
    return res.status(400).json({ error: 'Username, rating, and comment are required' });
  }
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
  const newReview = {
    id: reviews.length + 1,
    username,
    rating: parseInt(rating, 10),
    comment,
    createdAt: new Date().toISOString()
  };
  reviews.push(newReview);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
  res.json(newReview);
});

// User Auth Endpoints

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
  if (userExists) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  const obscuredPassword = Buffer.from(password).toString('base64');
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    password: obscuredPassword,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  
  res.json({ status: 'success', username: newUser.username });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  
  const obscuredPassword = Buffer.from(password).toString('base64');
  if (user.password !== obscuredPassword) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  
  res.json({ status: 'success', username: user.username });
});

app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
