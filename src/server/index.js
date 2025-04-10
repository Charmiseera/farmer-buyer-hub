const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://techyguides8:tCUYecjIdwGgP0Oo@cluster0.xnbcp.mongodb.net/agriconnect?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define models (schemas)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'buyer', 'admin'], required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: 'https://via.placeholder.com/400x300?text=No+Image' },
  availableUntil: { type: Date, required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String },
  location: { type: String }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerName: { type: String },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String },
  quantityOrdered: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Delivered', 'Canceled'], default: 'Pending' }
}, { timestamps: true });

// Create models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Basic routes
app.get('/', (req, res) => {
  res.send('AgriConnect API is running!');
});

// User routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, location, phone } = req.body;
    const user = new User({ name, email, password, role, location, phone });
    await user.save();
    res.status(201).json({ 
      token: 'dummy-token',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.password !== password) { // In a real app, compare hashed passwords
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      token: 'dummy-token',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/me', async (req, res) => {
  try {
    // In a real app, extract user ID from JWT token
    // For now, just return a mock user
    res.json({
      id: '1',
      name: 'Demo User',
      email: 'user@example.com',
      role: 'farmer',
      location: 'Sample Location',
      phone: '555-123-4567'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products.map(product => ({
      id: product._id,
      cropName: product.cropName,
      description: product.description,
      quantity: product.quantity,
      unit: product.unit,
      price: product.price,
      image: product.image,
      availableUntil: product.availableUntil,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      location: product.location,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/farmer/:farmerId', async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.params.farmerId });
    res.json(products.map(product => ({
      id: product._id,
      cropName: product.cropName,
      description: product.description,
      quantity: product.quantity,
      unit: product.unit,
      price: product.price,
      image: product.image,
      availableUntil: product.availableUntil,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      location: product.location,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({
      id: product._id,
      cropName: product.cropName,
      description: product.description,
      quantity: product.quantity,
      unit: product.unit,
      price: product.price,
      image: product.image,
      availableUntil: product.availableUntil,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      location: product.location,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order routes
app.get('/api/orders/buyer/:buyerId', async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.buyerId }).populate('productId');
    res.json(orders.map(order => ({
      id: order._id,
      productId: order.productId._id,
      product: {
        id: order.productId._id,
        cropName: order.productId.cropName,
        description: order.productId.description,
        quantity: order.productId.quantity,
        unit: order.productId.unit,
        price: order.productId.price,
        image: order.productId.image,
        availableUntil: order.productId.availableUntil,
        farmerId: order.productId.farmerId,
        farmerName: order.productId.farmerName,
        location: order.productId.location,
        createdAt: order.productId.createdAt,
        updatedAt: order.productId.updatedAt
      },
      buyerId: order.buyerId,
      buyerName: order.buyerName,
      farmerId: order.farmerId,
      farmerName: order.farmerName,
      quantityOrdered: order.quantityOrdered,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/farmer/:farmerId', async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.params.farmerId }).populate('productId');
    res.json(orders.map(order => ({
      id: order._id,
      productId: order.productId._id,
      product: {
        id: order.productId._id,
        cropName: order.productId.cropName,
        description: order.productId.description,
        quantity: order.productId.quantity,
        unit: order.productId.unit,
        price: order.productId.price,
        image: order.productId.image,
        availableUntil: order.productId.availableUntil,
        farmerId: order.productId.farmerId,
        farmerName: order.productId.farmerName,
        location: order.productId.location,
        createdAt: order.productId.createdAt,
        updatedAt: order.productId.updatedAt
      },
      buyerId: order.buyerId,
      buyerName: order.buyerName,
      farmerId: order.farmerId,
      farmerName: order.farmerName,
      quantityOrdered: order.quantityOrdered,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modified product creation route to handle JSON directly
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    await product.save();
    res.status(201).json({
      id: product._id,
      cropName: product.cropName,
      description: product.description,
      quantity: product.quantity,
      unit: product.unit,
      price: product.price,
      image: product.image,
      availableUntil: product.availableUntil,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      location: product.location,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
