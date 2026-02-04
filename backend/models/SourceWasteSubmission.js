import { db, formatRow, formatRows } from '../config/database.js';
import User from './User.js';
import WasteCategory from './WasteCategory.js';

const SourceWasteSubmission = {
  // Find all source waste submissions with populated relations
  find: (conditions = {}) => {
    let query = `
      SELECT sws.*,
             u.full_name as vendor_full_name, u.email as vendor_email,
             u.phone as vendor_phone, u.address as vendor_address,
             wc.name as category_name, wc.description as category_description,
             wc.color as category_color, wc.icon as category_icon
      FROM source_waste_submissions sws
      LEFT JOIN users u ON sws.vendor_id = u.id
      LEFT JOIN waste_categories wc ON sws.category_id = wc.id
      WHERE 1=1
    `;
    const params = [];

    if (conditions.vendor_id) {
      query += ' AND sws.vendor_id = ?';
      params.push(conditions.vendor_id);
    }
    if (conditions.status) {
      query += ' AND sws.status = ?';
      params.push(conditions.status);
    }

    query += ' ORDER BY sws.created_at DESC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    return rows.map(row => {
      const submission = formatRow({
        id: row.id,
        vendor_id: row.vendor_id,
        category_id: row.category_id,
        title: row.title,
        description: row.description,
        quantity: row.quantity,
        unit: row.unit,
        condition: row.condition,
        location: row.location,
        pickup_date: row.pickup_date,
        estimated_value: row.estimated_value,
        image_url: row.image_url,
        status: row.status,
        admin_notes: row.admin_notes,
        rejection_reason: row.rejection_reason,
        actual_value: row.actual_value,
        submitted_at: row.submitted_at,
        processed_at: row.processed_at,
        created_at: row.created_at,
        updated_at: row.updated_at
      });

      // Populate vendor
      submission.vendor_id = {
        id: row.vendor_id,
        full_name: row.vendor_full_name,
        email: row.vendor_email,
        phone: row.vendor_phone,
        address: row.vendor_address
      };

      // Populate category
      submission.category_id = {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description,
        color: row.category_color,
        icon: row.category_icon
      };

      return submission;
    });
  },

  // Find source waste submission by ID
  findById: (id) => {
    const stmt = db.prepare(`
      SELECT sws.*,
             u.full_name as vendor_full_name, u.email as vendor_email,
             u.phone as vendor_phone, u.address as vendor_address,
             wc.name as category_name, wc.description as category_description,
             wc.color as category_color, wc.icon as category_icon
      FROM source_waste_submissions sws
      LEFT JOIN users u ON sws.vendor_id = u.id
      LEFT JOIN waste_categories wc ON sws.category_id = wc.id
      WHERE sws.id = ?
    `);
    const row = stmt.get(id);

    if (!row) return null;

    const submission = formatRow({
      id: row.id,
      vendor_id: row.vendor_id,
      category_id: row.category_id,
      title: row.title,
      description: row.description,
      quantity: row.quantity,
      unit: row.unit,
      condition: row.condition,
      location: row.location,
      pickup_date: row.pickup_date,
      estimated_value: row.estimated_value,
      image_url: row.image_url,
      status: row.status,
      admin_notes: row.admin_notes,
      rejection_reason: row.rejection_reason,
      actual_value: row.actual_value,
      submitted_at: row.submitted_at,
      processed_at: row.processed_at,
      created_at: row.created_at,
      updated_at: row.updated_at
    });

    // Populate vendor
    submission.vendor_id = {
      id: row.vendor_id,
      full_name: row.vendor_full_name,
      email: row.vendor_email,
      phone: row.vendor_phone,
      address: row.vendor_address
    };

    // Populate category
    submission.category_id = {
      id: row.category_id,
      name: row.category_name,
      description: row.category_description,
      color: row.category_color,
      icon: row.category_icon
    };

    return submission;
  },

  // Create source waste submission
  create: (submissionData) => {
    const stmt = db.prepare(`
      INSERT INTO source_waste_submissions (
        vendor_id, category_id, title, description, quantity, unit,
        condition, location, pickup_date, estimated_value, image_url,
        status, admin_notes, rejection_reason, actual_value,
        submitted_at, processed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      submissionData.vendor_id,
      submissionData.category_id,
      submissionData.title,
      submissionData.description,
      submissionData.quantity,
      submissionData.unit,
      submissionData.condition,
      submissionData.location,
      submissionData.pickup_date,
      submissionData.estimated_value || 0,
      submissionData.image_url || '',
      submissionData.status || 'pending',
      submissionData.admin_notes || '',
      submissionData.rejection_reason || '',
      submissionData.actual_value || null,
      submissionData.submitted_at || new Date().toISOString(),
      submissionData.processed_at || null
    );

    return SourceWasteSubmission.findById(result.lastInsertRowid);
  },

  // Update source waste submission
  findByIdAndUpdate: (id, updates) => {
    const allowedFields = [
      'title', 'description', 'quantity', 'unit', 'condition',
      'location', 'pickup_date', 'estimated_value', 'image_url',
      'status', 'admin_notes', 'rejection_reason', 'actual_value',
      'processed_at'
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
      return SourceWasteSubmission.findById(id);
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE source_waste_submissions SET ${setParts.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    return SourceWasteSubmission.findById(id);
  },

  // Delete source waste submission
  findByIdAndDelete: (id) => {
    const stmt = db.prepare('DELETE FROM source_waste_submissions WHERE id = ?');
    return stmt.run(id);
  },

  // Delete many (for seeding)
  deleteMany: (conditions = {}) => {
    if (Object.keys(conditions).length === 0) {
      const stmt = db.prepare('DELETE FROM source_waste_submissions');
      return stmt.run();
    }
    return { changes: 0 };
  }
};

export default SourceWasteSubmission;
