import { db, formatRow, formatRows } from '../config/database.js';

const User = {
  // Find user by email
  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return formatRow(stmt.get(email));
  },

  // Find user by ID
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return formatRow(stmt.get(id));
  },

  // Find all users
  find: (conditions = {}) => {
    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (conditions.role) {
      query += ' AND role = ?';
      params.push(conditions.role);
    }
    if (conditions.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(conditions.is_active ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    return formatRows(stmt.all(...params));
  },

  // Create user
  create: (userData) => {
    const stmt = db.prepare(`
      INSERT INTO users (
        email, password, full_name, role, phone, address, profile_photo,
        is_active, vendor_status, business_name, business_type,
        business_license, years_in_business, approval_notes, approved_by, approved_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userData.email,
      userData.password,
      userData.full_name,
      userData.role,
      userData.phone || '',
      userData.address || '',
      userData.profile_photo || '',
      userData.is_active !== undefined ? (userData.is_active ? 1 : 0) : 1,
      userData.vendor_status || null,
      userData.business_name || '',
      userData.business_type || '',
      userData.business_license || '',
      userData.years_in_business || '',
      userData.approval_notes || '',
      userData.approved_by || '',
      userData.approved_at || null
    );

    return User.findById(result.lastInsertRowid);
  },

  // Update user
  findByIdAndUpdate: (id, updates) => {
    const allowedFields = [
      'email', 'password', 'full_name', 'role', 'phone', 'address',
      'profile_photo', 'is_active', 'vendor_status', 'business_name',
      'business_type', 'business_license', 'years_in_business',
      'approval_notes', 'approved_by', 'approved_at'
    ];

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
      return User.findById(id);
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE users SET ${setParts.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    return User.findById(id);
  },

  // Delete user
  findByIdAndDelete: (id) => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  },

  // Delete many (for seeding)
  deleteMany: (conditions = {}) => {
    if (Object.keys(conditions).length === 0) {
      const stmt = db.prepare('DELETE FROM users');
      return stmt.run();
    }
    // For specific conditions, implement as needed
    return { changes: 0 };
  }
};

export default User;
