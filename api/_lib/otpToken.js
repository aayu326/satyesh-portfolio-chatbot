const crypto = require('crypto');

// Serverless functions are stateless between invocations (and can even run on
// different instances back to back), so we can't reliably keep an in-memory
// otpStore like a traditional Node server. Instead we pack {email, otp,
// name, phone, expiresAt} into a signed token and hand it back to the
// browser; the browser sends it back on /verify-otp, and we just check the
// signature + expiry instead of looking anything up server-side.

const SECRET = process.env.OTP_SECRET || 'change-me-in-.env-OTP_SECRET';

function sign(payloadObj) {
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verify(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');

  // Constant-time comparison to avoid timing attacks.
  const a = Buffer.from(sig || '');
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.expiresAt || Date.now() > data.expiresAt) return null;
    return data;
  } catch {
    return null;
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { sign, verify, generateOTP };
