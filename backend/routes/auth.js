import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = { ...user };
    delete userObj.password;

    res.json({
      success: true,
      data: {
        user: userObj,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role, phone, address } = req.body;

    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      full_name,
      role,
      phone: phone || '',
      address: address || '',
      is_active: role === 'user' ? true : false,
      vendor_status: role === 'vendor' ? 'pending' : undefined
    };

    const user = User.create(userData);
    const userObj = { ...user };
    delete userObj.password;

    // Auto-login for regular users
    let token = null;
    if (role === 'user') {
      token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
    }

    res.status(201).json({
      success: true,
      data: {
        user: userObj,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userObj = { ...user };
    delete userObj.password;

    res.json({
      success: true,
      data: { user: userObj }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Get all users (Admin only)
router.get('/users', async (req, res) => {
  try {
    const users = User.find({});
    const usersWithoutPassword = users.map(user => {
      const userObj = { ...user };
      delete userObj.password;
      return userObj;
    });

    res.json({
      success: true,
      data: usersWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user status (Admin only)
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = User.findByIdAndUpdate(id, updates);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userObj = { ...user };
    delete userObj.password;

    res.json({
      success: true,
      data: userObj
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user (Admin only)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = User.findByIdAndUpdate(id, updates);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userObj = { ...user };
    delete userObj.password;

    res.json({
      success: true,
      data: userObj
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = User.findByIdAndUpdate(decoded.userId, updates);
    const userObj = { ...user };
    delete userObj.password;

    res.json({
      success: true,
      data: { user: userObj }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

