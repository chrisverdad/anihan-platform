import { db, formatRow, formatRows } from '../config/database.js';

const Product = {
  // Find all products
  find: (conditions = {}) => {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (conditions.is_available !== undefined) {
      query += ' AND is_available = ?';
      params.push(conditions.is_available ? 1 : 0);
    }
    if (conditions.category) {
      query += ' AND category = ?';
      params.push(conditions.category);
    }

    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    return formatRows(stmt.all(...params));
  },

  // Find product by ID
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    return formatRow(stmt.get(id));
  },

  // Create product
  create: (productData) => {
    const stmt = db.prepare(`
      INSERT INTO products (
        name, description, price, category, image_url,
        stock_quantity, unit, is_available
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const isAvailable = productData.stock_quantity > 0 
      ? (productData.is_available !== false) 
      : false;

    const result = stmt.run(
      productData.name,
      productData.description,
      productData.price,
      productData.category,
      productData.image_url || '',
      productData.stock_quantity || 0,
      productData.unit,
      isAvailable ? 1 : 0
    );

    return Product.findById(result.lastInsertRowid);
  },

  // Update product
  findByIdAndUpdate: (id, updates) => {
    const allowedFields = [
      'name', 'description', 'price', 'category', 'image_url',
      'stock_quantity', 'unit', 'is_available'
    ];

    const setParts = [];
    const values = [];

    // Auto out-of-stock logic
    if (updates.stock_quantity !== undefined && updates.stock_quantity === 0) {
      updates.is_available = false;
    }

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        if (key === 'is_available') {
          setParts.push(`${key} = ?`);
          values.push(value ? 1 : 0);
        } else {
          setParts.push(`${key} = ?`);
          values.push(value);
        }
      }
    }

    if (setParts.length === 0) {
      return Product.findById(id);
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE products SET ${setParts.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    return Product.findById(id);
  },

  // Delete product
  findByIdAndDelete: (id) => {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    return stmt.run(id);
  },

  // Delete many (for seeding)
  deleteMany: (conditions = {}) => {
    if (Object.keys(conditions).length === 0) {
      const stmt = db.prepare('DELETE FROM products');
      return stmt.run();
    }
    return { changes: 0 };
  }
};

export default Product;
