const { applyCors } = require('./_lib/cors');
const { verify } = require('./_lib/otpToken');
const { sendNewChatUserEmail } = require('./_lib/mailer');

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { token, otp } = req.body || {};
    if (!token || !otp) {
      return res.status(400).json({ success: false, error: 'Token and OTP are required' });
    }

    const data = verify(token);
    if (!data) {
      return res.status(400).json({ success: false, error: 'OTP expired or invalid. Please request a new one.' });
    }
    if (data.otp !== String(otp).trim()) {
      return res.status(400).json({ success: false, error: 'Incorrect OTP. Please try again.' });
    }

    const { name, email, phone } = data;
    const emailSent = await sendNewChatUserEmail({ name, email, phone });

    res.json({ success: true, message: 'Email verified! Welcome.', emailSent });
  } catch (err) {
    console.error('verify-otp error:', err.message);
    res.status(500).json({ success: false, error: 'Verification failed. Please try again.' });
  }
};
