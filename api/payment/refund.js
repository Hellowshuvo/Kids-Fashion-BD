// Vercel Serverless Function for Refunding UddoktaPay / Paymently Payment
const DEFAULT_BASE_URL = 'https://kidsfashionbd.paymently.io/api';
const DEFAULT_API_KEY = 'lbK81QaiOQsiAsoJ9zA5cnPffFZxncpekiF3PPZK';

async function getParsedBody(req) {
  if (req.body) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string' && req.body.trim()) {
      try {
        return JSON.parse(req.body);
      } catch (e) {
        return {};
      }
    }
  }
  if (req.readableEnded) {
    return {};
  }
  return new Promise((resolve) => {
    let data = '';
    const timer = setTimeout(() => resolve({}), 2000);
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      clearTimeout(timer);
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => {
      clearTimeout(timer);
      resolve({});
    });
  });
}

function sendResponse(res, statusCode, data) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, RT-UDDOKTAPAY-API-KEY');

  if (typeof res.status === 'function') {
    if (typeof res.json === 'function') {
      return res.status(statusCode).json(data);
    }
    res.status(statusCode);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data));
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, RT-UDDOKTAPAY-API-KEY');
    if (typeof res.status === 'function') {
      return res.status(200).end();
    }
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendResponse(res, 405, { status: false, message: 'Method Not Allowed' });
  }

  try {
    const body = await getParsedBody(req);
    const transactionId = body.transaction_id || body.transactionId;

    if (!transactionId) {
      return sendResponse(res, 400, { status: false, message: 'Missing transaction_id' });
    }

    const baseUrl = (process.env.PAYMENTLY_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
    const apiKey = process.env.PAYMENTLY_API_KEY || DEFAULT_API_KEY;

    const endpoint = baseUrl.endsWith('/api')
      ? `${baseUrl}/refund-payment`
      : `${baseUrl}/api/refund-payment`;

    const gatewayResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'RT-UDDOKTAPAY-API-KEY': apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: String(transactionId),
        payment_method: String(body.payment_method || body.paymentMethod || 'bkash'),
        amount: String(body.amount),
        product_name: String(body.product_name || body.productName || 'Kids Fashion BD Item'),
        reason: String(body.reason || 'Customer Requested Refund'),
      }),
    });

    const data = await gatewayResponse.json().catch(() => ({
      status: false,
      message: 'Invalid response from refund gateway',
    }));

    return sendResponse(res, gatewayResponse.status, data);
  } catch (err) {
    return sendResponse(res, 500, {
      status: false,
      message: err.message || 'Server error processing refund',
    });
  }
}
