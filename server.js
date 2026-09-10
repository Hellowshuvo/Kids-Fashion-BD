import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCharge, verifyPayment, refundPayment } from './server/paymentService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually if process.env values are missing
if (!process.env.PAYMENTLY_API_KEY && fs.existsSync(path.join(__dirname, '.env'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
    if (match && !match[1].startsWith('#')) {
      const key = match[1];
      const value = (match[2] || '').trim().replace(/^['\"]|['\"]$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const PORT = process.env.PORT || 5000;
const baseUrl = process.env.PAYMENTLY_BASE_URL || 'https://kidsfashionbd.paymently.io/api';
const apiKey = process.env.PAYMENTLY_API_KEY || '';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // API Routes
  if (pathname === '/api/payment/create-charge' && req.method === 'POST') {
    try {
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
      return sendJson(res, result.httpStatus, result.data);
    } catch (err) {
      return sendJson(res, 500, { status: false, message: err.message || 'Server error' });
    }
  }

  if (pathname === '/api/payment/verify' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const result = await verifyPayment({
        baseUrl,
        apiKey,
        invoiceId: body.invoice_id || body.invoiceId,
      });
      return sendJson(res, result.httpStatus, result.data);
    } catch (err) {
      return sendJson(res, 500, { status: false, message: err.message || 'Server error' });
    }
  }

  if (pathname === '/api/payment/refund' && req.method === 'POST') {
    try {
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
      return sendJson(res, result.httpStatus, result.data);
    } catch (err) {
      return sendJson(res, 500, { status: false, message: err.message || 'Server error' });
    }
  }

  // Static files from dist/ (if built)
  const distDir = path.join(__dirname, 'dist');
  let filePath = path.join(distDir, pathname === '/' ? 'index.html' : pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return fs.createReadStream(filePath).pipe(res);
  }

  // Fallback to index.html for SPA
  const indexHtml = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return fs.createReadStream(indexHtml).pipe(res);
  }

  sendJson(res, 404, { status: false, message: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Kids Fashion BD Secure Payment Server running on http://localhost:${PORT}`);
});
