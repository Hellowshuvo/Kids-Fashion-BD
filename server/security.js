import crypto from 'node:crypto';

// In-memory rate limiting store
const rateLimitStores = new Map();

/**
 * Creates an in-memory sliding window rate limiter
 * @param {string} limiterName
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Max requests allowed in window
 */
export function checkRateLimit(limiterName, ip, windowMs, maxRequests) {
  if (!rateLimitStores.has(limiterName)) {
    rateLimitStores.set(limiterName, new Map());
  }
  const store = rateLimitStores.get(limiterName);
  const now = Date.now();
  const key = ip || 'unknown-ip';

  let entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { allowed: true, remaining: maxRequests - 1, resetAt: entry.resetAt };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

// Clean up stale rate limits every 10 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const store of rateLimitStores.values()) {
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) {
        store.delete(key);
      }
    }
  }
}, 10 * 60 * 1000);
if (cleanupInterval.unref) cleanupInterval.unref();

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

// ----------------- ADMIN SESSIONS -----------------

const activeSessions = new Map(); // token -> { username, expiresAt }

export function loginAdmin(username, password) {
  const envUsername = process.env.ADMIN_USERNAME || 'admin';
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envPassword) {
    return {
      success: false,
      message: 'ADMIN_PASSWORD is not set in .env. Please configure ADMIN_PASSWORD in .env to enable admin login.',
    };
  }

  // Case-insensitive username match with trimming
  const usernameMatch = (username || '').trim().toLowerCase() === (envUsername || '').trim().toLowerCase();
  const passwordBuffer = Buffer.from(password || '');
  const envPasswordBuffer = Buffer.from(envPassword);

  const passwordMatch =
    passwordBuffer.length === envPasswordBuffer.length &&
    crypto.timingSafeEqual(passwordBuffer, envPasswordBuffer);

  if (!usernameMatch || !passwordMatch) {
    return { success: false, message: 'Invalid admin username or password' };
  }

  // Generate cryptographically secure session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  activeSessions.set(token, {
    username: envUsername,
    expiresAt,
  });

  return { success: true, token, expiresAt, username: envUsername };
}

export function verifyAdminSession(req) {
  let token = null;

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  if (!token && req.headers['x-admin-token']) {
    token = String(req.headers['x-admin-token']).trim();
  }

  if (!token && req.headers['cookie']) {
    const match = req.headers['cookie'].match(/admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) return false;

  const session = activeSessions.get(token);
  if (!session) return false;

  if (session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return false;
  }

  return session;
}

export function logoutAdmin(token) {
  if (token) {
    activeSessions.delete(token);
  }
  return true;
}

// ----------------- INPUT SANITIZATION & VALIDATION -----------------

export function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim()) && email.length <= 120;
}

export function validateBangladeshPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const clean = phone.replace(/[^0-9]/g, '');
  // Matches 013-019 (11 digits) or +88013-+88019 (13 digits)
  return /^(88)?01[3-9]\d{8}$/.test(clean);
}

export function sanitizeObject(obj, maxStrLen = 500) {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      clean[key] = sanitizeHtml(value.slice(0, maxStrLen)).trim();
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value, maxStrLen);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}
