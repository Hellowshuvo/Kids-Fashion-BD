import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');

// Ensure data and backup directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

export const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'kidsfashionbd.sqlite');

let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db) {
  // Execute schema creation
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      division TEXT,
      city_area TEXT,
      address TEXT NOT NULL,
      notes TEXT,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      trx_id TEXT,
      invoice_id TEXT,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      promo_code TEXT,
      shipping REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      items_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'Unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discount_percent REAL NOT NULL,
      is_active INTEGER DEFAULT 1
    );
  `);

  // Insert default coupons if not already existing
  const insertCoupon = db.prepare(`
    INSERT OR IGNORE INTO coupons (code, discount_percent, is_active)
    VALUES (?, ?, 1)
  `);
  insertCoupon.run('KIDSBD10', 10);
  insertCoupon.run('WELCOME5', 5);
}

// ----------------- ORDERS -----------------

export function createOrder(data) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO orders (
      order_id, customer_name, customer_phone, customer_email,
      division, city_area, address, notes,
      payment_method, payment_status, trx_id, invoice_id,
      subtotal, discount, promo_code, shipping, total,
      status, items_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.orderId,
    data.customerName,
    data.customerPhone,
    data.customerEmail || null,
    data.division || 'Dhaka',
    data.cityArea || '',
    data.address,
    data.notes || '',
    data.paymentMethod,
    data.paymentStatus || 'Pending',
    data.trxId || null,
    data.invoiceId || null,
    Number(data.subtotal) || 0,
    Number(data.discount) || 0,
    data.promoCode || null,
    Number(data.shipping) || 0,
    Number(data.total) || 0,
    data.status || 'Pending',
    typeof data.items === 'string' ? data.items : JSON.stringify(data.items || [])
  );

  return getOrderById(data.orderId);
}

export function getOrderById(orderId) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM orders WHERE order_id = ?').get(orderId);
  if (!row) return null;
  return formatOrderRow(row);
}

export function trackOrder(orderId, phone) {
  const db = getDb();
  // Normalize phone for comparison (remove spaces, +88, etc.)
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-11);
  const row = db.prepare('SELECT * FROM orders WHERE order_id = ?').get(orderId);
  if (!row) return null;

  const dbPhone = (row.customer_phone || '').replace(/[^0-9]/g, '').slice(-11);
  if (dbPhone !== cleanPhone) {
    return { error: 'Phone number does not match this Order ID' };
  }
  return formatOrderRow(row);
}

export function getOrders({ search = '', status = '', limit = 100, offset = 0 } = {}) {
  const db = getDb();
  let query = 'SELECT * FROM orders WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search && search.trim()) {
    query += ' AND (order_id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? OR trx_id LIKE ?)';
    const s = `%${search.trim()}%`;
    params.push(s, s, s, s);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  const rows = db.prepare(query).all(...params);
  return rows.map(formatOrderRow);
}

export function updateOrderStatus(orderId, status, paymentStatus) {
  const db = getDb();
  if (paymentStatus) {
    db.prepare(`
      UPDATE orders 
      SET status = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE order_id = ?
    `).run(status, paymentStatus, orderId);
  } else {
    db.prepare(`
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE order_id = ?
    `).run(status, orderId);
  }
  return getOrderById(orderId);
}

export function updateOrderPayment(orderId, paymentStatus, trxId, invoiceId) {
  const db = getDb();
  db.prepare(`
    UPDATE orders 
    SET payment_status = ?, trx_id = COALESCE(?, trx_id), invoice_id = COALESCE(?, invoice_id), updated_at = CURRENT_TIMESTAMP 
    WHERE order_id = ?
  `).run(paymentStatus, trxId || null, invoiceId || null, orderId);
  return getOrderById(orderId);
}

function formatOrderRow(row) {
  let parsedItems = [];
  try {
    parsedItems = JSON.parse(row.items_json);
  } catch (e) {
    parsedItems = [];
  }
  return {
    id: row.id,
    orderId: row.order_id,
    customer: {
      name: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email,
      division: row.division,
      cityArea: row.city_area,
      address: row.address,
      notes: row.notes,
    },
    payment: {
      method: row.payment_method,
      status: row.payment_status,
      trxId: row.trx_id,
      invoiceId: row.invoice_id,
    },
    items: parsedItems,
    subtotal: row.subtotal,
    discount: row.discount,
    promoCode: row.promo_code,
    shipping: row.shipping,
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ----------------- NEWSLETTER -----------------

export function addNewsletterSubscriber(email, ipAddress) {
  const db = getDb();
  try {
    db.prepare(`
      INSERT INTO newsletter_subscribers (email, ip_address) 
      VALUES (?, ?)
    `).run(email.toLowerCase().trim(), ipAddress || null);
    return { success: true, isNew: true };
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return { success: true, isNew: false, message: 'Already subscribed' };
    }
    throw err;
  }
}

export function getNewsletterSubscribers({ search = '', limit = 200 } = {}) {
  const db = getDb();
  let query = 'SELECT * FROM newsletter_subscribers WHERE 1=1';
  const params = [];

  if (search && search.trim()) {
    query += ' AND email LIKE ?';
    params.push(`%${search.trim().toLowerCase()}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(Number(limit));

  return db.prepare(query).all(...params);
}

// ----------------- CONTACT SUBMISSIONS -----------------

export function createContactSubmission({ name, phone, email, subject, message }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO contact_submissions (name, phone, email, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(name, phone || null, email || null, subject || 'General Inquiry', message);
  return { success: true };
}

export function getContactSubmissions({ search = '', status = '', limit = 100 } = {}) {
  const db = getDb();
  let query = 'SELECT * FROM contact_submissions WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search && search.trim()) {
    query += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR message LIKE ?)';
    const s = `%${search.trim()}%`;
    params.push(s, s, s, s);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(Number(limit));

  return db.prepare(query).all(...params);
}

export function updateContactStatus(id, status) {
  const db = getDb();
  db.prepare('UPDATE contact_submissions SET status = ? WHERE id = ?').run(status, Number(id));
  return { success: true };
}

// ----------------- COUPONS -----------------

export function validateCoupon(code) {
  const db = getDb();
  const cleanCode = (code || '').trim().toUpperCase();
  const row = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(cleanCode);
  if (!row) {
    return { valid: false, message: 'Invalid or expired promo code' };
  }
  return {
    valid: true,
    code: row.code,
    discountPercent: row.discount_percent,
  };
}

// ----------------- ADMIN METRICS -----------------

export function getAdminMetrics() {
  const db = getDb();
  const totalOrdersRow = db.prepare('SELECT COUNT(*) as count FROM orders').get();
  const totalRevenueRow = db.prepare("SELECT SUM(total) as revenue FROM orders WHERE status != 'Cancelled'").get();
  const pendingOrdersRow = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'").get();
  const totalSubscribersRow = db.prepare('SELECT COUNT(*) as count FROM newsletter_subscribers').get();
  const totalMessagesRow = db.prepare("SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'Unread'").get();

  return {
    totalOrders: totalOrdersRow?.count || 0,
    totalRevenue: totalRevenueRow?.revenue || 0,
    pendingOrders: pendingOrdersRow?.count || 0,
    totalSubscribers: totalSubscribersRow?.count || 0,
    unreadMessages: totalMessagesRow?.count || 0,
  };
}

// ----------------- DATABASE BACKUP -----------------

export function performBackup() {
  if (!fs.existsSync(DB_PATH)) {
    return { success: false, message: 'Database file not found yet' };
  }

  const today = new Date().toISOString().slice(0, 10);
  const backupFileName = `kidsfashionbd-backup-${today}.sqlite`;
  const targetPath = path.join(BACKUPS_DIR, backupFileName);

  try {
    fs.copyFileSync(DB_PATH, targetPath);

    // Keep only last 7 daily backups
    const allFiles = fs.readdirSync(BACKUPS_DIR).filter(f => f.startsWith('kidsfashionbd-backup-') && f.endsWith('.sqlite'));
    allFiles.sort().reverse();
    if (allFiles.length > 7) {
      for (const oldFile of allFiles.slice(7)) {
        try {
          fs.unlinkSync(path.join(BACKUPS_DIR, oldFile));
        } catch (e) {}
      }
    }

    return {
      success: true,
      backupFile: backupFileName,
      backupPath: targetPath,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Schedule automated daily backup (every 24 hours)
setInterval(() => {
  try {
    performBackup();
  } catch (e) {
    console.error('Automated backup error:', e);
  }
}, 24 * 60 * 60 * 1000);
