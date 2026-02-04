import { db, formatRow, formatRows } from '../config/database.js';

const WasteType = {
  // Find all waste types
  find: (conditions = {}) => {
    let query = 'SELECT * FROM waste_types WHERE 1=1';
    const params = [];

    if (conditions.category) {
      query += ' AND category = ?';
      params.push(conditions.category);
    }

    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    return formatRows(stmt.all(...params));
  },

  // Find waste type by ID
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM waste_types WHERE id = ?');
    return formatRow(stmt.get(id));
  },

  // Create waste type
  create: (wasteTypeData) => {
    const stmt = db.prepare(`
      INSERT INTO waste_types (
        name, description, image_url, category, damage_level
      ) VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      wasteTypeData.name,
      wasteTypeData.description,
      wasteTypeData.image_url,
      wasteTypeData.category,
      wasteTypeData.damage_level
    );

    return WasteType.findById(result.lastInsertRowid);
  },

  // Update waste type
  findByIdAndUpdate: (id, updates) => {
    const allowedFields = ['name', 'description', 'image_url', 'category', 'damage_level'];
    const setParts = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        setParts.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (setParts.length === 0) {
      return WasteType.findById(id);
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE waste_types SET ${setParts.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    return WasteType.findById(id);
  },

  // Delete waste type
  findByIdAndDelete: (id) => {
    const stmt = db.prepare('DELETE FROM waste_types WHERE id = ?');
    return stmt.run(id);
  },

  // Delete many (for seeding)
  deleteMany: (conditions = {}) => {
    if (Object.keys(conditions).length === 0) {
      const stmt = db.prepare('DELETE FROM waste_types');
      return stmt.run();
    }
    return { changes: 0 };
  }
};

export default WasteType;
