import { db, formatRow, formatRows } from '../config/database.js';
import User from './User.js';
import Product from './Product.js';

const Order = {
  // Find all orders with populated relations
  find: (conditions = {}) => {
    let query = `
      SELECT o.*,
             u.full_name as user_full_name, u.email as user_email,
             u.phone as user_phone, u.address as user_address
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (conditions.user_id) {
      query += ' AND o.user_id = ?';
      params.push(conditions.user_id);
    }
    if (conditions.status) {
      query += ' AND o.status = ?';
      params.push(conditions.status);
    }

    query += ' ORDER BY o.created_at DESC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    // Format and populate
    return rows.map(row => {
      const order = formatRow({
        id: row.id,
        user_id: row.user_id,
        product_id: row.product_id,
        quantity: row.quantity,
        total_price: row.total_price,
        status: row.status,
        payment_status: row.payment_status,
        payment_method: row.payment_method,
        payment_reference: row.payment_reference,
        delivery_status: row.delivery_status,
        delivery_address: row.delivery_address,
        delivery_notes: row.delivery_notes,
        order_date: row.order_date,
        delivery_date: row.delivery_date,
        notes: row.notes,
        created_at: row.created_at,
        updated_at: row.updated_at
      });

      // Populate user
      order.user_id = {
        id: row.user_id,
        full_name: row.user_full_name,
        email: row.user_email,
        phone: row.user_phone,
        address: row.user_address
      };

      // Populate product
      order.product_id = Product.findById(row.product_id);

      return order;
    });
  },

  // Find order by ID with populated relations
  findById: (id) => {
    const stmt = db.prepare(`
      SELECT o.*,
             u.full_name as user_full_name, u.email as user_email,
             u.phone as user_phone, u.address as user_address
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `);
    const row = stmt.get(id);

    if (!row) return null;

    const order = formatRow({
      id: row.id,
      user_id: row.user_id,
      product_id: row.product_id,
      quantity: row.quantity,
      total_price: row.total_price,
      status: row.status,
      payment_status: row.payment_status,
      payment_method: row.payment_method,
      payment_reference: row.payment_reference,
      delivery_status: row.delivery_status,
      delivery_address: row.delivery_address,
      delivery_notes: row.delivery_notes,
      order_date: row.order_date,
      delivery_date: row.delivery_date,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at
    });

    // Populate user
    order.user_id = {
      id: row.user_id,
      full_name: row.user_full_name,
      email: row.user_email,
      phone: row.user_phone,
      address: row.user_address
    };

    // Populate product
    order.product_id = Product.findById(row.product_id);

    return order;
  },

  // Create order
  create: (orderData) => {
    const stmt = db.prepare(`
      INSERT INTO orders (
        user_id, product_id, quantity, total_price, payment_method,
        payment_reference, delivery_address, delivery_notes, order_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      orderData.user_id,
      orderData.product_id,
      orderData.quantity,
      orderData.total_price,
      orderData.payment_method,
      orderData.payment_reference || '',
      orderData.delivery_address,
      orderData.delivery_notes || '',
      orderData.order_date || new Date().toISOString()
    );

    return Order.findById(result.lastInsertRowid);
  },

  // Update order
  findByIdAndUpdate: (id, updates) => {
    const allowedFields = [
      'status', 'payment_status', 'payment_method', 'payment_reference',
      'delivery_status', 'delivery_address', 'delivery_notes',
      'delivery_date', 'notes'
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
      return Order.findById(id);
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE orders SET ${setParts.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    return Order.findById(id);
  },

  // Delete order
  findByIdAndDelete: (id) => {
    const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
    return stmt.run(id);
  },

  // Delete many (for seeding)
  deleteMany: (conditions = {}) => {
    if (Object.keys(conditions).length === 0) {
      const stmt = db.prepare('DELETE FROM orders');
      return stmt.run();
    }
    return { changes: 0 };
  }
};

export default Order;
