import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = Order.find({});
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { user_id, product_id, quantity, total_price, payment_method, payment_reference, delivery_address, delivery_notes } = req.body;

    // Check product availability
    const product = Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // Create order
    const order = Order.create({
      user_id,
      product_id,
      quantity,
      total_price,
      payment_method,
      payment_reference: payment_reference || '',
      delivery_address,
      delivery_notes: delivery_notes || '',
      order_date: new Date().toISOString()
    });

    // Update product stock
    const newStock = product.stock_quantity - quantity;
    Product.findByIdAndUpdate(product_id, {
      stock_quantity: newStock,
      is_available: newStock > 0
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  try {
    const order = Order.findByIdAndUpdate(req.params.id, req.body);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    Order.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

