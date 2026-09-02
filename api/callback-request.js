const { applyCors } = require('./_lib/cors');
const { sendCallbackEmail } = require('./_lib/mailer');

const phoneRegex = /^[6-9]\d{9}$/;

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { name, email, phone, query, callback_number } = req.body || {};
    if (!name || !email || !phone || !query || !callback_number) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const cleanedNumber = callback_number.replace(/\D/g, '');
    if (!phoneRegex.test(cleanedNumber)) {
      return res.status(400).json({ success: false, error: 'Invalid callback number' });
    }

    const emailSent = await sendCallbackEmail({ name, email, phone }, query, cleanedNumber);
    if (emailSent) {
      res.json({ success: true, message: 'Callback request received successfully' });
    } else {
      res.json({ success: false, message: 'Failed to send email notification' });
    }
  } catch (err) {
    console.error('callback-request error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to process callback request' });
  }
};
