import { db, formatRow, formatRows } from '../config/database.js';
import User from './User.js';
import WasteType from './WasteType.js';

const WasteSubmission = {
  // Find all waste submissions with populated relations
  find: (conditions = {}) => {
    let query = `
      SELECT ws.*,
             u.full_name as user_full_name, u.email as user_email,
             u.phone as user_phone, u.address as user_address,
             wt.name as waste_type_name, wt.description as waste_type_description,
             wt.image_url as waste_type_image_url, wt.category as waste_type_category,
             wt.damage_level as waste_type_damage_level
      FROM waste_submissions ws
      LEFT JOIN users u ON ws.user_id = u.id
      LEFT JOIN waste_types wt ON ws.waste_type_id = wt.id
      WHERE 1=1
    `;
    const params = [];

    if (conditions.user_id) {
      query += ' AND ws.user_id = ?';
      params.push(conditions.user_id);
    }
    if (conditions.status) {
      query += ' AND ws.status = ?';
      params.push(conditions.status);
    }

    query += ' ORDER BY ws.created_at DESC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    return rows.map(row => {
      const submission = formatRow({
        id: row.id,
        user_id: row.user_id,
        waste_type_id: row.waste_type_id,
        quantity: row.quantity,
        unit: row.unit,
        description: row.description,
        status: row.status,
        submitted_at: row.submitted_at,
        processed_at: row.processed_at,
        title: row.title,
        category: row.category,
        condition: row.condition,
        created_at: row.created_at,
        updated_at: row.updated_at
      });

      // Populate user
      submission.user_id = {
        id: row.user_id,
        full_name: row.user_full_name,
        email: row.user_email,
        phone: row.user_phone,
        address: row.user_address
      };

      // Populate waste type
      submission.waste_type_id = {
        id: row.waste_type_id,
        name: row.waste_type_name,
        description: row.waste_type_description,
        image_url: row.waste_type_image_url,
        category: row.waste_type_category,
        damage_level: row.waste_type_damage_level
      };

      return submission;
    });
  },

  // Find waste submission by ID
  findById: (id) => {
    const stmt = db.prepare(`
      SELECT ws.*,
             u.full_name as user_full_name, u.email as user_email,
             u.phone as user_phone, u.address as user_address,
             wt.name as waste_type_name, wt.description as waste_type_description,
             wt.image_url as waste_type_image_url, wt.category as waste_type_category,
             wt.damage_level as waste_type_damage_level
      FROM waste_submissions ws
      LEFT JOIN users u ON ws.user_id = u.id
      LEFT JOIN waste_types wt ON ws.waste_type_id = wt.id
      WHERE ws.id = ?
    `);
    const row = stmt.get(id);

    if (!row) return null;

    const submission = formatRow({
      id: row.id,
      user_id: row.user_id,
      waste_type_id: row.waste_type_id,
      quantity: row.quantity,
      unit: row.unit,
      description: row.description,
      status: row.status,
      submitted_at: row.submitted_at,
      processed_at: row.processed_at,
      title: row.title,
      category: row.category,
      condition: row.condition,
      created_at: row.created_at,
      updated_at: row.updated_at
    });

    // Populate user
    submission.user_id = {
      id: row.user_id,
      full_name: row.user_full_name,
      email: row.user_email,
      phone: row.user_phone,
      address: row.user_address
    };

    // Populate waste type
    submission.waste_type_id = {
      id: row.waste_type_id,
      name: row.waste_type_name,
      description: row.waste_type_description,
      image_url: row.waste_type_image_url,
      category: row.waste_type_category,
      damage_level: row.waste_type_damage_level
    };

    return submission;
  },

  // Create waste submission
  create: (submissionData) => {
    const stmt = db.prepare(`
      INSERT INTO waste_submissions (
        user_id, waste_type_id, quantity, unit, description,
        status, submitted_at, processed_at, title, category, condition
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      submissionData.user_id,
      submissionData.waste_type_id,
      submissionData.quantity,
      submissionData.unit,
      submissionData.description || '',
      submissionData.status || 'pending',
      submissionData.submitted_at || new Date().toISOString(),
      submissionData.processed_at || null,
      submissionData.title || '',
      submissionData.category || '',
      submissionData.condition || ''
    );

    return WasteSubmission.findById(result.lastInsertRowid);
  },

  // Update waste submission
  findByIdAndUpdate: (id, updates) => {
    const allowedFields = [
      'quantity', 'unit', 'description', 'status',
      'processed_at', 'title', 'category', 'condition'
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
      return WasteSubmission.findById(id);
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE waste_submissions SET ${setParts.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    return WasteSubmission.findById(id);
  },

  // Delete waste submission
  findByIdAndDelete: (id) => {
    const stmt = db.prepare('DELETE FROM waste_submissions WHERE id = ?');
    return stmt.run(id);
  },

  // Delete many (for seeding)
  deleteMany: (conditions = {}) => {
    if (Object.keys(conditions).length === 0) {
      const stmt = db.prepare('DELETE FROM waste_submissions');
      return stmt.run();
    }
    return { changes: 0 };
  }
};

export default WasteSubmission;
