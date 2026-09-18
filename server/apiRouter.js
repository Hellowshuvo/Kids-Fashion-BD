import {
  createOrder,
  getOrderById,
  trackOrder,
  getOrders,
  updateOrderStatus,
  updateOrderPayment,
  addNewsletterSubscriber,
  getNewsletterSubscribers,
  createContactSubmission,
  getContactSubmissions,
  updateContactStatus,
  validateCoupon,
  getAdminMetrics,
  performBackup,
  DB_PATH,
} from './db.js';

import {
  checkRateLimit,
  getClientIp,
  loginAdmin,
  verifyAdminSession,
  logoutAdmin,
  validateEmail,
  validateBangladeshPhone,
  sanitizeHtml,
  sanitizeObject,
} from './security.js';

import { createCharge, verifyPayment, refundPayment } from './paymentService.js';

export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large (limit 1MB)'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Malformed JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

export function sendJson(res, statusCode, data, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    ...headers,
  };

  if (typeof res.writeHead === 'function') {
    res.writeHead(statusCode, defaultHeaders);
    res.end(JSON.stringify(data));
  } else if (typeof res.setHeader === 'function') {
    res.statusCode = statusCode;
    for (const [key, value] of Object.entries(defaultHeaders)) {
      res.setHeader(key, value);
    }
    res.end(JSON.stringify(data));
  }
}

export function sendCsv(res, filename, csvString) {
  const headers = {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'X-Content-Type-Options': 'nosniff',
  };

  if (typeof res.writeHead === 'function') {
    res.writeHead(200, headers);
    res.end(csvString);
  } else if (typeof res.setHeader === 'function') {
    res.statusCode = 200;
    for (const [k, v] of Object.entries(headers)) {
      res.setHeader(k, v);
    }
    res.end(csvString);
  }
}

/**
 * Unified API Request Handler
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @returns {Promise<boolean>} true if handled, false otherwise
 */
export async function handleApiRequest(req, res, env = {}) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const ip = getClientIp(req);

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    const origin = req.headers.origin || '*';
    const preflightHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token',
      'Access-Control-Allow-Credentials': 'true',
    };
    if (typeof res.writeHead === 'function') {
      res.writeHead(204, preflightHeaders);
      res.end();
    } else {
      res.statusCode = 204;
      for (const [k, v] of Object.entries(preflightHeaders)) res.setHeader(k, v);
      res.end();
    }
    return true;
  }

  // Only handle /api/ routes
  if (!pathname.startsWith('/api/')) {
    return false;
  }

  const baseUrl = env.PAYMENTLY_BASE_URL || process.env.PAYMENTLY_BASE_URL || 'https://kidsfashionbd.paymently.io/api';
  const apiKey = env.PAYMENTLY_API_KEY || process.env.PAYMENTLY_API_KEY || '';

  try {
    // ==========================================
    // PUBLIC ROUTES
    // ==========================================

    // 1. POST /api/orders (Create Order)
    if (pathname === '/api/orders' && method === 'POST') {
      const limit = checkRateLimit('orders', ip, 60 * 1000, 10);
      if (!limit.allowed) {
        sendJson(res, 429, { status: false, message: 'Too many order requests. Please wait a moment.' });
        return true;
      }

      const body = await readJsonBody(req);
      if (!body.fullName || !body.phone || !body.streetAddress) {
        sendJson(res, 400, { status: false, message: 'Full name, phone, and address are required' });
        return true;
      }

      if (!validateBangladeshPhone(body.phone)) {
        sendJson(res, 400, { status: false, message: 'Please enter a valid Bangladesh phone number (e.g. 01842533335)' });
        return true;
      }

      if (body.email && !validateEmail(body.email)) {
        sendJson(res, 400, { status: false, message: 'Invalid email address format' });
        return true;
      }

      const cleanData = sanitizeObject(body);
      const orderId = cleanData.orderId || ('KB-' + Math.floor(100000 + Math.random() * 900000));

      const createdOrder = createOrder({
        orderId,
        customerName: cleanData.fullName,
        customerPhone: cleanData.phone,
        customerEmail: cleanData.email || null,
        division: cleanData.division || 'Dhaka',
        cityArea: cleanData.cityArea || '',
        address: cleanData.streetAddress,
        notes: cleanData.notes || '',
        paymentMethod: cleanData.paymentMethod || 'cod',
        paymentStatus: cleanData.paymentStatus || (cleanData.paymentMethod === 'cod' ? 'Due on Delivery' : 'Pending Verification'),
        trxId: cleanData.trxId || null,
        invoiceId: cleanData.invoiceId || null,
        subtotal: cleanData.subtotal || 0,
        discount: cleanData.discount || 0,
        promoCode: cleanData.promoCode || null,
        shipping: cleanData.shipping || 0,
        total: cleanData.total || 0,
        status: 'Pending',
        items: cleanData.items || [],
      });

      sendJson(res, 201, { status: true, order: createdOrder, message: 'Order placed successfully' });
      return true;
    }

    // 2. GET /api/orders/track (Rate limited Order Tracking Lookup by Phone + Order ID)
    if (pathname === '/api/orders/track' && method === 'GET') {
      const limit = checkRateLimit('track_orders', ip, 5 * 60 * 1000, 10);
      if (!limit.allowed) {
        sendJson(res, 429, { status: false, message: 'Too many tracking requests. Please try again later.' });
        return true;
      }

      const orderId = parsedUrl.searchParams.get('orderId');
      const phone = parsedUrl.searchParams.get('phone');

      if (!orderId || !phone) {
        sendJson(res, 400, { status: false, message: 'Both Order ID and Phone Number are required' });
        return true;
      }

      const orderResult = trackOrder(orderId.trim(), phone.trim());
      if (!orderResult) {
        sendJson(res, 404, { status: false, message: 'Order not found' });
        return true;
      }

      if (orderResult.error) {
        sendJson(res, 403, { status: false, message: orderResult.error });
        return true;
      }

      sendJson(res, 200, { status: true, order: orderResult });
      return true;
    }

    // 3. POST /api/newsletter (Subscribe Email)
    if (pathname === '/api/newsletter' && method === 'POST') {
      const limit = checkRateLimit('newsletter', ip, 60 * 1000, 10);
      if (!limit.allowed) {
        sendJson(res, 429, { status: false, message: 'Too many requests. Please try again shortly.' });
        return true;
      }

      const body = await readJsonBody(req);
      const email = (body.email || '').trim();

      if (!validateEmail(email)) {
        sendJson(res, 400, { status: false, message: 'Please enter a valid email address' });
        return true;
      }

      const result = addNewsletterSubscriber(email, ip);
      sendJson(res, 200, {
        status: true,
        message: result.isNew ? 'Subscribed successfully! Use code KIDSBD10 for 10% OFF.' : 'You are already subscribed! Use code KIDSBD10.',
        couponCode: 'KIDSBD10',
      });
      return true;
    }

    // 4. POST /api/contact (Customer Inquiries / Contact Form)
    if (pathname === '/api/contact' && method === 'POST') {
      const limit = checkRateLimit('contact', ip, 60 * 1000, 10);
      if (!limit.allowed) {
        sendJson(res, 429, { status: false, message: 'Too many messages submitted. Please wait.' });
        return true;
      }

      const body = await readJsonBody(req);
      if (!body.name || !body.message) {
        sendJson(res, 400, { status: false, message: 'Name and message are required' });
        return true;
      }

      const clean = sanitizeObject(body);
      createContactSubmission({
        name: clean.name,
        phone: clean.phone || null,
        email: clean.email || null,
        subject: clean.subject || 'General Inquiry',
        message: clean.message,
      });

      sendJson(res, 201, { status: true, message: 'Your message has been received! Our studio will contact you shortly.' });
      return true;
    }

    // 5. POST /api/coupons/validate
    if (pathname === '/api/coupons/validate' && method === 'POST') {
      const body = await readJsonBody(req);
      const result = validateCoupon(body.code);
      if (!result.valid) {
        sendJson(res, 400, { status: false, message: result.message });
      } else {
        sendJson(res, 200, { status: true, coupon: result });
      }
      return true;
    }

    // 6. POST /api/payment/create-charge
    if (pathname === '/api/payment/create-charge' && method === 'POST') {
      const limit = checkRateLimit('payment_charge', ip, 60 * 1000, 15);
      if (!limit.allowed) {
        sendJson(res, 429, { status: false, message: 'Rate limit exceeded. Please wait.' });
        return true;
      }

      if (!apiKey) {
        sendJson(res, 500, { status: false, message: 'Payment gateway API key is not configured on the server.' });
        return true;
      }

      const body = await readJsonBody(req);
      const result = await createCharge({
        baseUrl,
        apiKey,
        fullName: body.fullName,
        email: body.email,
        amount: body.amount,
        metadata: body.metadata,
        redirectUrl: body.redirectUrl,
        cancelUrl: body.cancelUrl,
      });

      sendJson(res, result.httpStatus, result.data);
      return true;
    }

    // 7. POST /api/payment/verify
    if (pathname === '/api/payment/verify' && method === 'POST') {
      const limit = checkRateLimit('payment_verify', ip, 60 * 1000, 20);
      if (!limit.allowed) {
        sendJson(res, 429, { status: false, message: 'Too many verification attempts.' });
        return true;
      }

      if (!apiKey) {
        sendJson(res, 500, { status: false, message: 'Payment gateway API key is not configured on the server.' });
        return true;
      }

      const body = await readJsonBody(req);
      const invoiceId = body.invoice_id || body.invoiceId;
      const result = await verifyPayment({ baseUrl, apiKey, invoiceId });

      // If verification succeeded and metadata has order_id, update database
      if (result.data && (result.data.status === 'COMPLETED' || result.data.status === true)) {
        const orderId = result.data.metadata?.order_id;
        const trxId = result.data.transaction_id || invoiceId;
        if (orderId) {
          updateOrderPayment(orderId, 'Paid Online (Verified)', trxId, invoiceId);
        }
      }

      sendJson(res, result.httpStatus, result.data);
      return true;
    }

    // ==========================================
    // ADMIN AUTHENTICATION
    // ==========================================

    // POST /api/admin/login
    if (pathname === '/api/admin/login' && method === 'POST') {
      const limit = checkRateLimit('admin_login', ip, 15 * 60 * 1000, 10);
      if (!limit.allowed) {
        sendJson(res, 429, { status: false, message: 'Too many failed login attempts. Account temporarily locked for 15 minutes.' });
        return true;
      }

      const body = await readJsonBody(req);
      const result = loginAdmin(body.username, body.password);

      if (!result.success) {
        sendJson(res, 401, { status: false, message: result.message });
      } else {
        sendJson(res, 200, {
          status: true,
          token: result.token,
          expiresAt: result.expiresAt,
          username: result.username,
        });
      }
      return true;
    }

    // POST /api/admin/logout
    if (pathname === '/api/admin/logout' && method === 'POST') {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-admin-token'];
      logoutAdmin(token);
      sendJson(res, 200, { status: true, message: 'Logged out successfully' });
      return true;
    }

    // GET /api/admin/check-auth
    if (pathname === '/api/admin/check-auth' && method === 'GET') {
      const session = verifyAdminSession(req);
      if (!session) {
        sendJson(res, 401, { status: false, authenticated: false });
      } else {
        sendJson(res, 200, { status: true, authenticated: true, username: session.username });
      }
      return true;
    }

    // ==========================================
    // PROTECTED ADMIN ROUTES (Require Admin Session)
    // ==========================================

    if (pathname.startsWith('/api/admin/') || pathname === '/api/payment/refund') {
      const session = verifyAdminSession(req);
      if (!session) {
        sendJson(res, 401, { status: false, message: 'Unauthorized. Valid admin session token required.' });
        return true;
      }

      // GET /api/admin/metrics
      if (pathname === '/api/admin/metrics' && method === 'GET') {
        const metrics = getAdminMetrics();
        sendJson(res, 200, { status: true, metrics, dbPath: DB_PATH });
        return true;
      }

      // GET /api/admin/orders
      if (pathname === '/api/admin/orders' && method === 'GET') {
        const search = parsedUrl.searchParams.get('search') || '';
        const status = parsedUrl.searchParams.get('status') || '';
        const limit = parsedUrl.searchParams.get('limit') || 100;
        const orders = getOrders({ search, status, limit });
        sendJson(res, 200, { status: true, orders });
        return true;
      }

      // PATCH /api/admin/orders/status
      if (pathname === '/api/admin/orders/status' && method === 'PATCH') {
        const body = await readJsonBody(req);
        if (!body.orderId || !body.status) {
          sendJson(res, 400, { status: false, message: 'orderId and status are required' });
          return true;
        }
        const updated = updateOrderStatus(body.orderId, body.status, body.paymentStatus);
        sendJson(res, 200, { status: true, order: updated });
        return true;
      }

      // GET /api/admin/subscribers
      if (pathname === '/api/admin/subscribers' && method === 'GET') {
        const search = parsedUrl.searchParams.get('search') || '';
        const subscribers = getNewsletterSubscribers({ search });
        sendJson(res, 200, { status: true, subscribers });
        return true;
      }

      // GET /api/admin/contacts
      if (pathname === '/api/admin/contacts' && method === 'GET') {
        const search = parsedUrl.searchParams.get('search') || '';
        const status = parsedUrl.searchParams.get('status') || '';
        const contacts = getContactSubmissions({ search, status });
        sendJson(res, 200, { status: true, contacts });
        return true;
      }

      // PATCH /api/admin/contacts/status
      if (pathname === '/api/admin/contacts/status' && method === 'PATCH') {
        const body = await readJsonBody(req);
        updateContactStatus(body.id, body.status);
        sendJson(res, 200, { status: true });
        return true;
      }

      // POST /api/admin/backup (On-demand database backup)
      if (pathname === '/api/admin/backup' && method === 'POST') {
        const backupResult = performBackup();
        sendJson(res, backupResult.success ? 200 : 500, backupResult);
        return true;
      }

      // POST /api/payment/refund (PROTECTED REFUND)
      if (pathname === '/api/payment/refund' && method === 'POST') {
        if (!apiKey) {
          sendJson(res, 500, { status: false, message: 'Payment gateway API key is not configured.' });
          return true;
        }
        const body = await readJsonBody(req);
        const result = await refundPayment({
          baseUrl,
          apiKey,
          transactionId: body.transaction_id || body.transactionId,
          paymentMethod: body.payment_method || body.paymentMethod,
          amount: body.amount,
          productName: body.product_name || body.productName,
          reason: body.reason,
        });

        if (body.orderId && (result.data?.status === true || result.data?.status === 'COMPLETED')) {
          updateOrderStatus(body.orderId, 'Refunded', 'Refunded via Gateway');
        }

        sendJson(res, result.httpStatus, result.data);
        return true;
      }

      // GET /api/admin/export/:type (Export CSV)
      if (pathname.startsWith('/api/admin/export/')) {
        const exportType = pathname.split('/').pop();
        if (exportType === 'orders') {
          const orders = getOrders({ limit: 10000 });
          let csv = 'Order ID,Date,Customer Name,Phone,Email,Division,Area,Address,Payment Method,Payment Status,TrxID,Subtotal,Discount,Shipping,Total,Status,Items\n';
          for (const o of orders) {
            const itemsStr = o.items.map(i => `${i.product?.name || 'Item'} (${i.size}, ${i.color?.name || ''}) x${i.quantity}`).join('; ');
            csv += `"${o.orderId}","${o.createdAt}","${o.customer.name}","${o.customer.phone}","${o.customer.email || ''}","${o.customer.division || ''}","${o.customer.cityArea || ''}","${(o.customer.address || '').replace(/"/g, '""')}","${o.payment.method}","${o.payment.status}","${o.payment.trxId || ''}",${o.subtotal},${o.discount},${o.shipping},${o.total},"${o.status}","${itemsStr.replace(/"/g, '""')}"\n`;
          }
          sendCsv(res, `kidsfashionbd-orders-${new Date().toISOString().slice(0, 10)}.csv`, csv);
          return true;
        }

        if (exportType === 'subscribers') {
          const subscribers = getNewsletterSubscribers({ limit: 10000 });
          let csv = 'ID,Email,Subscribed Date,IP Address\n';
          for (const s of subscribers) {
            csv += `${s.id},"${s.email}","${s.created_at}","${s.ip_address || ''}"\n`;
          }
          sendCsv(res, `kidsfashionbd-subscribers-${new Date().toISOString().slice(0, 10)}.csv`, csv);
          return true;
        }

        if (exportType === 'contacts') {
          const contacts = getContactSubmissions({ limit: 10000 });
          let csv = 'ID,Date,Name,Phone,Email,Subject,Status,Message\n';
          for (const c of contacts) {
            csv += `${c.id},"${c.created_at}","${c.name}","${c.phone || ''}","${c.email || ''}","${c.subject || ''}","${c.status}","${(c.message || '').replace(/"/g, '""')}"\n`;
          }
          sendCsv(res, `kidsfashionbd-inquiries-${new Date().toISOString().slice(0, 10)}.csv`, csv);
          return true;
        }
      }
    }

    sendJson(res, 404, { status: false, message: 'API route not found' });
    return true;
  } catch (err) {
    console.error('API Router Internal Error:', err);
    sendJson(res, 500, { status: false, message: 'Internal Server Error' });
    return true;
  }
}
