import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, '..', 'data', 'anihan.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
const initializeDatabase = () => {
  try {
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('vendor', 'admin', 'user')),
        phone TEXT DEFAULT '',
        address TEXT DEFAULT '',
        profile_photo TEXT DEFAULT '',
        is_active INTEGER DEFAULT 1,
        vendor_status TEXT CHECK(vendor_status IN ('pending', 'approved', 'rejected')),
        business_name TEXT DEFAULT '',
        business_type TEXT DEFAULT '',
        business_license TEXT DEFAULT '',
        years_in_business TEXT DEFAULT '',
        approval_notes TEXT DEFAULT '',
        approved_by TEXT DEFAULT '',
        approved_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL CHECK(price >= 0),
        category TEXT NOT NULL CHECK(category IN ('compost', 'fertilizer', 'preserved_food', 'processed_food', 'other')),
        image_url TEXT DEFAULT '',
        stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK(stock_quantity >= 0),
        unit TEXT NOT NULL CHECK(unit IN ('kg', 'bags', 'bottles', 'pieces', 'jars', 'boxes')),
        is_available INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Waste Categories table
    db.exec(`
      CREATE TABLE IF NOT EXISTS waste_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Waste Types table
    db.exec(`
      CREATE TABLE IF NOT EXISTS waste_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('fruit', 'vegetable', 'grain', 'other')),
        damage_level TEXT NOT NULL CHECK(damage_level IN ('slight', 'moderate', 'severe')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Waste Submissions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS waste_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        waste_type_id INTEGER NOT NULL,
        quantity REAL NOT NULL CHECK(quantity >= 1),
        unit TEXT NOT NULL CHECK(unit IN ('kg', 'pieces', 'baskets', 'bags', 'boxes', 'liters')),
        description TEXT DEFAULT '',
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'processed')),
        submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
        processed_at TEXT,
        title TEXT DEFAULT '',
        category TEXT DEFAULT '',
        condition TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (waste_type_id) REFERENCES waste_types(id) ON DELETE CASCADE
      )
    `);

    // Source Waste Submissions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS source_waste_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        quantity REAL NOT NULL CHECK(quantity >= 1),
        unit TEXT NOT NULL CHECK(unit IN ('kg', 'pieces', 'baskets', 'bags', 'boxes', 'liters')),
        condition TEXT NOT NULL CHECK(condition IN ('fresh', 'slightly_damaged', 'overripe', 'bruised', 'expired', 'other')),
        location TEXT NOT NULL,
        pickup_date TEXT NOT NULL,
        estimated_value REAL DEFAULT 0,
        image_url TEXT DEFAULT '',
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'collected', 'processed')),
        admin_notes TEXT DEFAULT '',
        rejection_reason TEXT DEFAULT '',
        actual_value REAL,
        submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
        processed_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES waste_categories(id) ON DELETE CASCADE
      )
    `);

    // Inventory Items table
    db.exec(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('compost', 'fertilizer', 'preserved_food', 'processed_food', 'other')),
        quantity REAL NOT NULL DEFAULT 0 CHECK(quantity >= 0),
        unit TEXT NOT NULL CHECK(unit IN ('kg', 'bags', 'bottles', 'pieces', 'jars', 'boxes')),
        price_per_unit REAL NOT NULL CHECK(price_per_unit >= 0),
        total_value REAL NOT NULL CHECK(total_value >= 0),
        source_waste_submission_id INTEGER,
        image_url TEXT DEFAULT '',
        is_available INTEGER DEFAULT 1,
        quantity_history TEXT DEFAULT '[]',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (source_waste_submission_id) REFERENCES source_waste_submissions(id) ON DELETE SET NULL
      )
    `);

    // Orders table
    db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL CHECK(quantity >= 1),
        total_price REAL NOT NULL CHECK(total_price >= 0),
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
        payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
        payment_method TEXT NOT NULL CHECK(payment_method IN ('cash', 'gcash')),
        payment_reference TEXT DEFAULT '',
        delivery_status TEXT DEFAULT 'pending' CHECK(delivery_status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed')),
        delivery_address TEXT NOT NULL,
        delivery_notes TEXT DEFAULT '',
        order_date TEXT DEFAULT CURRENT_TIMESTAMP,
        delivery_date TEXT,
        notes TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Deliveries table
    db.exec(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        delivery_person TEXT DEFAULT '',
        delivery_vehicle TEXT DEFAULT '',
        pickup_time TEXT,
        delivery_time TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed')),
        notes TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
      CREATE INDEX IF NOT EXISTS idx_waste_submissions_user_id ON waste_submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_source_waste_submissions_vendor_id ON source_waste_submissions(vendor_id);
      CREATE INDEX IF NOT EXISTS idx_inventory_items_vendor_id ON inventory_items(vendor_id);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Initialize on import
initializeDatabase();

// Helper function to format row (convert SQLite row to JSON format)
const formatRow = (row) => {
  if (!row) return null;
  const formatted = { ...row };
  // Convert integer booleans to actual booleans
  if (formatted.is_active !== undefined) formatted.is_active = Boolean(formatted.is_active);
  if (formatted.is_available !== undefined) formatted.is_available = Boolean(formatted.is_available);
  // Parse JSON fields
  if (formatted.quantity_history) {
    try {
      formatted.quantity_history = JSON.parse(formatted.quantity_history);
    } catch (e) {
      formatted.quantity_history = [];
    }
  }
  return formatted;
};

// Helper function to format rows array
const formatRows = (rows) => rows.map(formatRow);

export { db, formatRow, formatRows };
export default db;
