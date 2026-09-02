// ==============================================
// LOCAL DEV SERVER — for testing on localhost only.
// Not used in production; Vercel replaces this entirely when you deploy.
// Run with: npm run dev   (then open http://localhost:3000)
// ==============================================
require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Map URL paths to the same handler files Vercel would call.
const routes = {
  '/api/chat': require('./api/chat'),
  '/api/send-otp': require('./api/send-otp'),
  '/api/verify-otp': require('./api/verify-otp'),
  '/api/callback-request': require('./api/callback-request')
};

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };

function serveStatic(req, res) {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'public', filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
}

function collectBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { resolve({}); }
    });
  });
}

// Minimal req/res shim so the same api/*.js handlers work here and on Vercel.
function wrapRes(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
    return res;
  };
  return res;
}

const server = http.createServer(async (req, res) => {
  const handler = routes[req.url.split('?')[0]];

  if (handler) {
    req.body = req.method === 'POST' ? await collectBody(req) : {};
    wrapRes(res);
    try {
      await handler(req, res);
    } catch (err) {
      console.error('Handler error:', err);
      if (!res.writableEnded) res.status(500).json({ success: false, error: 'Internal error' });
    }
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`\n🚀 Local dev server running: http://localhost:${PORT}`);
  console.log(`   Chat widget demo page:     http://localhost:${PORT}/`);
  console.log(`   API base for widget:       http://localhost:${PORT}\n`);
  if (!process.env.ADMIN_EMAIL || !process.env.EMAIL_PASSWORD) {
    console.log('⚠️  ADMIN_EMAIL / EMAIL_PASSWORD not set — OTP & notification emails will fail.');
    console.log('   Make sure you have a real .env file (copied from .env.example) in this folder.\n');
  }
});
