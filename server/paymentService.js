// Server-side UddoktaPay / Paymently API integration
// This code runs strictly on the Node.js server to safeguard your secret API key.

export async function createCharge({ baseUrl, apiKey, fullName, email, amount, metadata = {}, redirectUrl, cancelUrl }) {
  if (!apiKey) {
    throw new Error('Missing PAYMENTLY_API_KEY in server environment.');
  }

  const cleanBaseUrl = (baseUrl || 'https://kidsfashionbd.paymently.io/api').replace(/\/+$/, '');
  const endpoint = cleanBaseUrl.endsWith('/api')
    ? `${cleanBaseUrl}/checkout-v2`
    : `${cleanBaseUrl}/api/checkout-v2`;

  const payload = {
    full_name: fullName || 'Customer',
    email: email || 'customer@kidsfashionbd.com',
    amount: String(amount),
    metadata: typeof metadata === 'object' ? metadata : {},
    redirect_url: redirectUrl,
    cancel_url: cancelUrl,
    return_type: 'GET',
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'RT-UDDOKTAPAY-API-KEY': apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({ status: false, message: 'Invalid server response' }));
  return { httpStatus: response.status, data };
}

export async function verifyPayment({ baseUrl, apiKey, invoiceId }) {
  if (!apiKey) {
    throw new Error('Missing PAYMENTLY_API_KEY in server environment.');
  }

  if (!invoiceId) {
    return { httpStatus: 400, data: { status: false, message: 'Missing invoice_id parameter' } };
  }

  const cleanBaseUrl = (baseUrl || 'https://kidsfashionbd.paymently.io/api').replace(/\/+$/, '');
  const endpoint = cleanBaseUrl.endsWith('/api')
    ? `${cleanBaseUrl}/verify-payment`
    : `${cleanBaseUrl}/api/verify-payment`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'RT-UDDOKTAPAY-API-KEY': apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ invoice_id: invoiceId }),
  });

  const data = await response.json().catch(() => ({ status: false, message: 'Invalid response from gateway' }));
  return { httpStatus: response.status, data };
}

export async function refundPayment({ baseUrl, apiKey, transactionId, paymentMethod, amount, productName, reason }) {
  if (!apiKey) {
    throw new Error('Missing PAYMENTLY_API_KEY in server environment.');
  }

  const cleanBaseUrl = (baseUrl || 'https://kidsfashionbd.paymently.io/api').replace(/\/+$/, '');
  const endpoint = cleanBaseUrl.endsWith('/api')
    ? `${cleanBaseUrl}/refund-payment`
    : `${cleanBaseUrl}/api/refund-payment`;

  const payload = {
    transaction_id: String(transactionId),
    payment_method: String(paymentMethod || 'bkash'),
    amount: String(amount),
    product_name: String(productName || 'Order Items'),
    reason: String(reason || 'Customer Requested Refund'),
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'RT-UDDOKTAPAY-API-KEY': apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({ status: false, message: 'Invalid response from refund gateway' }));
  return { httpStatus: response.status, data };
}
