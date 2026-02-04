import { db, formatRow, formatRows } from '../config/database.js';
import User from './User.js';
import SourceWasteSubmission from './SourceWasteSubmission.js';

const InventoryItem = {
  // Find all inventory items with populated relations
  find: (conditions = {}) => {
    let query = `
      SELECT ii.*,
             u.full_name as vendor_full_name, u.email as vendor_email,
             u.phone as vendor_phone, u.address as vendor_address
      FROM inventory_items ii
      LEFT JOIN users u ON ii.vendor_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (conditions.vendor_id) {
      query += ' AND ii.vendor_id = ?';
      params.push(conditions.vendor_id);
    }
    if (conditions.is_available !== undefined) {
      query += ' AND ii.is_available = ?';
      params.push(conditions.is_available ? 1 : 0);
    }

    query += ' ORDER BY ii.created_at DESC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    return rows.map(row => {
      const item = formatRow({
        id: row.id,
        vendor_id: row.vendor_id,
        product_name: row.product_name,
        description: row.description,
        category: row.category,
        quantity: row.quantity,
        unit: row.unit,
        price_per_unit: row.price_per_unit,
        total_value: row.total_value,
        source_waste_submission_id: row.source_waste_submission_id,
        image_url: row.image_url,
        is_available: row.is_available,
        quantity_history: row.quantity_history,
        created_at: row.created_at,
        updated_at: row.updated_at
      });

      // Populate vendor
      item.vendor_id = {
        id: row.vendor_id,
        full_name: row.vendor_full_name,
        email: row.vendor_email,
        phone: row.vendor_phone,
        address: row.vendor_address
      };

      // Populate source waste submission if exists
      if (row.source_waste_submission_id) {
        item.source_waste_submission_id = SourceWasteSubmission.findById(row.source_waste_submission_id);
      }

      return item;
    });
  },

  // Find inventory item by ID
  findById: (id) => {
    const stmt = db.prepare(`
      SELECT ii.*,
             u.full_name as vendor_full_name, u.email as vendor_email,
             u.phone as vendor_phone, u.address as vendor_address
      FROM inventory_items ii
      LEFT JOIN users u ON ii.vendor_id = u.id
      WHERE ii.id = ?
    `);
    const row = stmt.get(id);

    if (!row) return null;

    const item = formatRow({
      id: row.id,
      vendor_id: row.vendor_id,
      product_name: row.product_name,
      description: row.description,
      category: row.category,
      quantity: row.quantity,
      unit: row.unit,
      price_per_unit: row.price_per_unit,
      total_value: row.total_value,
      source_waste_submission_id: row.source_waste_submission_id,
      image_url: row.image_url,
      is_available: row.is_available,
      quantity_history: row.quantity_history,
      created_at: row.created_at,
      updated_at: row.updated_at
    });

    // Populate vendor
    item.vendor_id = {
      id: row.vendor_id,
      full_name: row.vendor_full_name,
      email: row.vendor_email,
      phone: row.vendor_phone,
      address: row.vendor_address
    };

    // Populate source waste submission if exists
    if (row.source_waste_submission_id) {
      item.source_waste_submission_id = SourceWasteSubmission.findById(row.source_waste_submission_id);
    }

    return item;
  },

  // Create inventory item
  create: (itemData) => {
    const quantityHistory = itemData.quantity_history 
      ? JSON.stringify(itemData.quantity_history) 
      : '[]';

    const stmt = db.prepare(`
      INSERT INTO inventory_items (
        vendor_id, product_name, description, category, quantity, unit,
        price_per_unit, total_value, source_waste_submission_id,
        image_url, is_available, quantity_history
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      itemData.vendor_id,
      itemData.product_name,
      itemData.description,
      itemData.category,
      itemData.quantity || 0,
      itemData.unit,
      itemData.price_per_unit,
      itemData.total_value,
      itemData.source_waste_submission_id || null,
      itemData.image_url || '',
      itemData.is_available !== undefined ? (itemData.is_available ? 1 : 0) : 1,
      quantityHistory
    );

    return InventoryItem.findById(result.lastInsertRowid);
  },

  // Update inventory item
  findByIdAndUpdate: (id, updates) => {
    const allowedFields = [
      'product_name', 'description', 'category', 'quantity', 'unit',
      'price_per_unit', 'total_value', 'source_waste_submission_id',
      'image_url', 'is_available', 'quantity_history'
    ];
    const setParts = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        if (key === 'is_available') {
          setParts.push(`${key} = ?`);
          values.push(value ? 1 : 0);
        } else if (key === 'quantity_history') {
          setParts.push(`${key} = ?`);
          values.push(JSON.stringify(value));
        } else {
          setParts.push(`${key} = ?`);
          values.push(value);
        }
      }
    }

    if (setParts.length === 0) {
      return InventoryItem.findById(id);
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE inventory_items SET ${setParts.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    return InventoryItem.findById(id);
  },

  // Delete inventory item
  findByIdAndDelete: (id) => {
    const stmt = db.prepare('DELETE FROM inventory_items WHERE id = ?');
    return stmt.run(id);
  },

  // Delete many (for seeding)
  deleteMany: (conditions = {}) => {
    if (Object.keys(conditions).length === 0) {
      const stmt = db.prepare('DELETE FROM inventory_items');
      return stmt.run();
    }
    return { changes: 0 };
  }
};

export default InventoryItem;
