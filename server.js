import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApiRequest, sendJson } from './server/apiRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually if process.env values are missing
if (fs.existsSync(path.join(__dirname, '.env'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
  envContent.split('\n').forEach((line) => {
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

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.sqlite': 'application/x-sqlite3',
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Handle all API routes
  if (pathname.startsWith('/api/')) {
    const handled = await handleApiRequest(req, res, { baseUrl, apiKey });
    if (handled) return;
  }

  // Static files from dist/ (if built)
  const distDir = path.join(__dirname, 'dist');
  let filePath = path.join(distDir, pathname === '/' ? 'index.html' : pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
    });
    return fs.createReadStream(filePath).pipe(res);
  }

  // Fallback to index.html for SPA routing
  const indexHtml = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
    });
    return fs.createReadStream(indexHtml).pipe(res);
  }

  sendJson(res, 404, { status: false, message: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Kids Fashion BD Secure Server running on http://localhost:${PORT}`);
});
