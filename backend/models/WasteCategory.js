import { db, formatRow, formatRows } from '../config/database.js';

const WasteCategory = {
  // Find all waste categories
  find: (conditions = {}) => {
    let query = 'SELECT * FROM waste_categories WHERE 1=1';
    const params = [];

    if (conditions.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(conditions.is_active ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    return formatRows(stmt.all(...params));
  },

  // Find waste category by ID
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM waste_categories WHERE id = ?');
    return formatRow(stmt.get(id));
  },

  // Create waste category
  create: (categoryData) => {
    const stmt = db.prepare(`
      INSERT INTO waste_categories (
        name, description, color, icon, is_active
      ) VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      categoryData.name,
      categoryData.description,
      categoryData.color,
      categoryData.icon,
      categoryData.is_active !== undefined ? (categoryData.is_active ? 1 : 0) : 1
    );

    return WasteCategory.findById(result.lastInsertRowid);
  },

  // Update waste category
  findByIdAndUpdate: (id, updates) => {
    const allowedFields = ['name', 'description', 'color', 'icon', 'is_active'];
    const setParts = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        if (key === 'is_active') {
          setParts.push(`${key} = ?`);
          values.push(value ? 1 : 0);
        } else {
          setParts.push(`${key} = ?`);
          values.push(value);
        }
      }
    }

    if (setParts.length === 0) {
      return WasteCategory.findById(id);
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE waste_categories SET ${setParts.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    return WasteCategory.findById(id);
  },

  // Delete waste category
  findByIdAndDelete: (id) => {
    const stmt = db.prepare('DELETE FROM waste_categories WHERE id = ?');
    return stmt.run(id);
  },

  // Delete many (for seeding)
  deleteMany: (conditions = {}) => {
    if (Object.keys(conditions).length === 0) {
      const stmt = db.prepare('DELETE FROM waste_categories');
      return stmt.run();
    }
    return { changes: 0 };
  }
};

export default WasteCategory;
