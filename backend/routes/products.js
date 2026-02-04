import express from 'express';
import Product from '../models/Product.js';
import upload from '../utils/fileUpload.js';
import { getFileUrl, deleteFile } from '../utils/fileUpload.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = Product.find({});
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Handle image upload
    let imageUrl = req.body.image_url || '';
    if (req.file) {
      imageUrl = getFileUrl(req.file.filename, 'products');
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      image_url: imageUrl,
      stock_quantity: parseInt(req.body.stock_quantity) || 0,
      unit: req.body.unit,
      is_available: req.body.stock_quantity > 0 ? (req.body.is_available !== false) : false
    };

    const product = Product.create(productData);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Delete uploaded file if product creation failed
    if (req.file) {
      deleteFile(`products/${req.file.filename}`);
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const existingProduct = Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      // Delete old image if it exists and is in uploads folder
      if (existingProduct.image_url) {
        deleteFile(existingProduct.image_url);
      }
      updates.image_url = getFileUrl(req.file.filename, 'products');
    }
    
    // Auto out-of-stock logic
    if (updates.stock_quantity !== undefined && updates.stock_quantity === 0) {
      updates.is_available = false;
    }

    const product = Product.findByIdAndUpdate(req.params.id, updates);
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    // Delete uploaded file if update failed
    if (req.file) {
      deleteFile(`products/${req.file.filename}`);
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    if (product) {
      // Delete associated image file
      if (product.image_url) {
        deleteFile(product.image_url);
      }
    }
    
    Product.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

