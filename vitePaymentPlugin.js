import { handleApiRequest } from './server/apiRouter.js';

export function paymentGatewayPlugin(env = {}) {
  const baseUrl = env.PAYMENTLY_BASE_URL || process.env.PAYMENTLY_BASE_URL || 'https://kidsfashionbd.paymently.io/api';
  const apiKey = env.PAYMENTLY_API_KEY || process.env.PAYMENTLY_API_KEY || '';

  return {
    name: 'payment-gateway-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url.startsWith('/api/')) {
          const handled = await handleApiRequest(req, res, { baseUrl, apiKey });
          if (handled) return;
        }
        next();
      });
    },
  };
}
