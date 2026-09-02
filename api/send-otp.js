const { applyCors } = require('./_lib/cors');
const { sign, generateOTP } = require('./_lib/otpToken');
const { sendOtpEmail } = require('./_lib/mailer');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { name, email, phone } = req.body || {};
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    if (!phoneRegex.test(phone.replace(/\D/g, '').slice(-10))) {
      return res.status(400).json({ success: false, error: 'Invalid phone number' });
    }

    const otp = generateOTP();
    // No server-side storage: the OTP + user details are packed into a signed
    // token that the browser holds onto and sends back on /verify-otp.
    const token = sign({ email, name, phone, otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    const emailSent = await sendOtpEmail({ name, email, otp });
    if (!emailSent) {
      return res.status(500).json({ success: false, error: 'Could not send OTP email. Check EMAIL/ADMIN env vars.' });
    }

    res.json({ success: true, message: 'OTP sent to your email address!', token });
  } catch (err) {
    console.error('send-otp error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to send OTP. Please try again.' });
  }
};
