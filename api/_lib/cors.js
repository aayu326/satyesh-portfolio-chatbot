// Vercel serverless functions don't get Express-style middleware, so each
// handler calls this first to set CORS headers and short-circuit preflight.
// Restricting ALLOWED_ORIGIN (env var) to your real site domain is recommended
// once you've confirmed everything works, instead of leaving it as "*".
function applyCors(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true; // caller should return immediately
  }
  return false;
}

module.exports = { applyCors };
