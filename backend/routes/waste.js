import express from 'express';
import WasteType from '../models/WasteType.js';
import WasteCategory from '../models/WasteCategory.js';
import WasteSubmission from '../models/WasteSubmission.js';
import SourceWasteSubmission from '../models/SourceWasteSubmission.js';
import InventoryItem from '../models/InventoryItem.js';
import { io } from '../server.js';

const router = express.Router();

// =====================
// Waste Types
// =====================
router.get('/types', async (req, res) => {
  try {
    const wasteTypes = WasteType.find({});
    res.json({ success: true, data: wasteTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/types', async (req, res) => {
  try {
    const wasteType = WasteType.create(req.body);

    // Emit socket event
    io.emit('waste:type:created', wasteType);

    res.status(201).json({ success: true, data: wasteType });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================
// Waste Categories
// =====================
router.get('/categories', async (req, res) => {
  try {
    const categories = WasteCategory.find({});
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = WasteCategory.create(req.body);

    io.emit('waste:category:created', category);

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const category = WasteCategory.findByIdAndUpdate(req.params.id, req.body);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    io.emit('waste:category:updated', category);

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    WasteCategory.findByIdAndDelete(req.params.id);

    io.emit('waste:category:deleted', { id: req.params.id });

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================
// Waste Submissions
// =====================
router.get('/submissions', async (req, res) => {
  try {
    const submissions = WasteSubmission.find({});
    res.json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/submissions', async (req, res) => {
  try {
    const submission = WasteSubmission.create(req.body);

    io.emit('waste:submission:created', submission);

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/submissions/:id', async (req, res) => {
  try {
    const submission = WasteSubmission.findByIdAndUpdate(req.params.id, req.body);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    io.emit('waste:submission:updated', submission);

    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/submissions/:id', async (req, res) => {
  try {
    WasteSubmission.findByIdAndDelete(req.params.id);

    io.emit('waste:submission:deleted', { id: req.params.id });

    res.json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================
// Source Waste Submissions
// =====================
router.get('/source-submissions', async (req, res) => {
  try {
    const submissions = SourceWasteSubmission.find({});
    res.json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/source-submissions', async (req, res) => {
  try {
    const submission = SourceWasteSubmission.create(req.body);

    io.emit('waste:source-submission:created', submission);

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/source-submissions/:id', async (req, res) => {
  try {
    const submission = SourceWasteSubmission.findByIdAndUpdate(req.params.id, req.body);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    io.emit('waste:source-submission:updated', submission);

    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/source-submissions/:id', async (req, res) => {
  try {
    SourceWasteSubmission.findByIdAndDelete(req.params.id);

    io.emit('waste:source-submission:deleted', { id: req.params.id });

    res.json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================
// Inventory Items
// =====================
router.get('/inventory', async (req, res) => {
  try {
    const items = InventoryItem.find({});
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/inventory', async (req, res) => {
  try {
    const item = InventoryItem.create(req.body);

    io.emit('waste:inventory:created', item);

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/inventory/:id', async (req, res) => {
  try {
    const item = InventoryItem.findByIdAndUpdate(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Inventory item not found' });

    io.emit('waste:inventory:updated', item);

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/inventory/:id', async (req, res) => {
  try {
    InventoryItem.findByIdAndDelete(req.params.id);

    io.emit('waste:inventory:deleted', { id: req.params.id });

    res.json({ success: true, message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
