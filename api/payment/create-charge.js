// Vercel Serverless Function for Creating UddoktaPay / Paymently Charge
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
    const baseUrl = (process.env.PAYMENTLY_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
    const apiKey = process.env.PAYMENTLY_API_KEY || DEFAULT_API_KEY;

    const endpoint = baseUrl.endsWith('/api')
      ? `${baseUrl}/checkout-v2`
      : `${baseUrl}/api/checkout-v2`;

    const payload = {
      full_name: body.fullName || 'Customer',
      email: body.email || 'customer@kidsfashionbd.com',
      amount: String(body.amount),
      metadata: typeof body.metadata === 'object' ? body.metadata : {},
      redirect_url: body.redirectUrl,
      cancel_url: body.cancelUrl,
      return_type: 'GET',
    };

    const gatewayResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'RT-UDDOKTAPAY-API-KEY': apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await gatewayResponse.json().catch(() => ({
      status: false,
      message: 'Invalid response from payment gateway',
    }));

    return sendResponse(res, gatewayResponse.status, data);
  } catch (err) {
    return sendResponse(res, 500, {
      status: false,
      message: err.message || 'Server error initiating payment',
    });
  }
}
