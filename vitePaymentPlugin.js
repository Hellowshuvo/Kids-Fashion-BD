import { createCharge, verifyPayment, refundPayment } from './server/paymentService.js';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
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
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function paymentGatewayPlugin(env = {}) {
  const baseUrl = env.PAYMENTLY_BASE_URL || process.env.PAYMENTLY_BASE_URL || 'https://kidsfashionbd.paymently.io/api';
  const apiKey = env.PAYMENTLY_API_KEY || process.env.PAYMENTLY_API_KEY || '';

  return {
    name: 'payment-gateway-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        if (url === '/api/payment/create-charge' && req.method === 'POST') {
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
          } catch (error) {
            return sendJson(res, 500, { status: false, message: error.message || 'Payment initiation failed' });
          }
        }

        if (url === '/api/payment/verify' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const result = await verifyPayment({
              baseUrl,
              apiKey,
              invoiceId: body.invoice_id || body.invoiceId,
            });
            return sendJson(res, result.httpStatus, result.data);
          } catch (error) {
            return sendJson(res, 500, { status: false, message: error.message || 'Payment verification failed' });
          }
        }

        if (url === '/api/payment/refund' && req.method === 'POST') {
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
          } catch (error) {
            return sendJson(res, 500, { status: false, message: error.message || 'Refund failed' });
          }
        }

        next();
      });
    },
  };
}
