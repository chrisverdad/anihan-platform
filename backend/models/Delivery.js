import { db, formatRow, formatRows } from '../config/database.js';

const Delivery = {
  // Find all deliveries
  find: (conditions = {}) => {
    let query = 'SELECT * FROM deliveries WHERE 1=1';
    const params = [];

    if (conditions.order_id) {
      query += ' AND order_id = ?';
      params.push(conditions.order_id);
    }
    if (conditions.status) {
      query += ' AND status = ?';
      params.push(conditions.status);
    }

    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    return formatRows(stmt.all(...params));
  },

  // Find delivery by ID
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM deliveries WHERE id = ?');
    return formatRow(stmt.get(id));
  },

  // Create delivery
  create: (deliveryData) => {
    const stmt = db.prepare(`
      INSERT INTO deliveries (
        order_id, delivery_person, delivery_vehicle, pickup_time,
        delivery_time, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      deliveryData.order_id,
      deliveryData.delivery_person || '',
      deliveryData.delivery_vehicle || '',
      deliveryData.pickup_time || null,
      deliveryData.delivery_time || null,
      deliveryData.status || 'pending',
      deliveryData.notes || ''
    );

    return Delivery.findById(result.lastInsertRowid);
  },

  // Update delivery
  findByIdAndUpdate: (id, updates) => {
    const allowedFields = [
      'delivery_person', 'delivery_vehicle', 'pickup_time',
      'delivery_time', 'status', 'notes'
    ];
    const setParts = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        setParts.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (setParts.length === 0) {
      return Delivery.findById(id);
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE deliveries SET ${setParts.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    return Delivery.findById(id);
  },

  // Delete delivery
  findByIdAndDelete: (id) => {
    const stmt = db.prepare('DELETE FROM deliveries WHERE id = ?');
    return stmt.run(id);
  },

  // Delete many (for seeding)
  deleteMany: (conditions = {}) => {
    if (Object.keys(conditions).length === 0) {
      const stmt = db.prepare('DELETE FROM deliveries');
      return stmt.run();
    }
    return { changes: 0 };
  }
};

export default Delivery;
