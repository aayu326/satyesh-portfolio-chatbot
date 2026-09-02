const nodemailer = require('nodemailer');
const P = require('./profile');

const EMAIL_USER = process.env.ADMIN_EMAIL || '';
const EMAIL_PASS = process.env.EMAIL_PASSWORD || '';

let transporter = null;
function getTransporter() {
  if (!EMAIL_USER || !EMAIL_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });
  }
  return transporter;
}

function nowIST() {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

const baseStyles = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Segoe UI',Arial,sans-serif; background:#f0f4f8; }
  .wrapper { max-width:560px; margin:30px auto; border-radius:16px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.12); }
  .header { background:linear-gradient(135deg,#1a4a2e 0%,#0d2d1a 100%); padding:34px 30px; text-align:center; }
  .header h1 { color:#fff; font-size:20px; margin-bottom:6px; }
  .header p { color:rgba(255,255,255,0.7); font-size:12px; }
  .body { background:#fff; padding:30px; }
  .info-item { background:#f7fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px 18px; margin-bottom:10px; }
  .ilabel { font-size:10px; color:#a0aec0; text-transform:uppercase; letter-spacing:1px; }
  .ivalue { font-size:14px; color:#2d3748; font-weight:600; margin-top:2px; }
  .footer { background:#1a4a2e; padding:20px; text-align:center; }
  .footer p { color:rgba(255,255,255,0.55); font-size:11px; line-height:1.7; }
`;

async function sendNewChatUserEmail({ name, email, phone }) {
  const t = getTransporter();
  if (!t) return false;
  try {
    await t.sendMail({
      from: EMAIL_USER,
      to: P.adminEmail,
      subject: '👋 New Visitor Started a Chat — Portfolio Bot',
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${baseStyles}</style></head>
      <body><div class="wrapper">
        <div class="header"><h1>👋 New Visitor Registered</h1><p>Someone started chatting on your portfolio</p></div>
        <div class="body">
          <div class="info-item"><div class="ilabel">Name</div><div class="ivalue">${name}</div></div>
          <div class="info-item"><div class="ilabel">Email</div><div class="ivalue">${email}</div></div>
          <div class="info-item"><div class="ilabel">Phone</div><div class="ivalue">${phone}</div></div>
          <div class="info-item"><div class="ilabel">Time</div><div class="ivalue">${nowIST()} IST</div></div>
        </div>
        <div class="footer"><p>Automated notification from your portfolio chatbot</p></div>
      </div></body></html>`
    });
    return true;
  } catch (err) {
    console.error('sendNewChatUserEmail failed:', err.message);
    return false;
  }
}

async function sendOtpEmail({ name, email, otp }) {
  const t = getTransporter();
  if (!t) return false;
  try {
    await t.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: '🔐 Your Verification Code',
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${baseStyles}
        .otp-box{background:linear-gradient(135deg,#f0f7f3,#e8f4ee);border:2px dashed #1a4a2e;border-radius:16px;padding:26px;margin:20px 0;text-align:center;}
        .otp-code{font-size:40px;font-weight:900;color:#1a4a2e;letter-spacing:10px;}
      </style></head>
      <body><div class="wrapper">
        <div class="header"><h1>Email Verification</h1><p>${P.name}'s Portfolio Chatbot</p></div>
        <div class="body" style="text-align:center;">
          <p style="font-size:15px;color:#333;">Hi ${name} 👋</p>
          <p style="color:#555;font-size:13px;margin-top:6px;">Use this code to verify your email and start chatting.</p>
          <div class="otp-box">
            <div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Your OTP</div>
            <div class="otp-code">${otp}</div>
            <div style="font-size:12px;color:#888;margin-top:10px;">Valid for 10 minutes</div>
          </div>
          <p style="font-size:12px;color:#888;">Don't share this code with anyone.</p>
        </div>
        <div class="footer"><p>${P.name} — ${P.location}</p></div>
      </div></body></html>`
    });
    return true;
  } catch (err) {
    console.error('sendOtpEmail failed:', err.message);
    return false;
  }
}

async function sendCallbackEmail({ name, email, phone }, query, callbackNumber) {
  const t = getTransporter();
  if (!t) return false;
  try {
    await t.sendMail({
      from: EMAIL_USER,
      to: P.adminEmail,
      subject: '📞 Callback Request — Portfolio Bot',
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${baseStyles}
        .phone-box{background:linear-gradient(135deg,#1a4a2e,#0d2d1a);border-radius:14px;padding:24px;text-align:center;margin-bottom:20px;}
        .phone-box .pnumber{color:#fff;font-size:30px;font-weight:800;letter-spacing:3px;}
        .query-box{background:#fff8f6;border-left:4px solid #c47f2a;border-radius:10px;padding:16px;margin-top:12px;}
      </style></head>
      <body><div class="wrapper">
        <div class="header"><h1>📞 Callback Requested</h1><p>A visitor wants a call back</p></div>
        <div class="body">
          <div class="phone-box"><div style="color:rgba(255,255,255,0.6);font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Callback Number</div><div class="pnumber">${callbackNumber}</div></div>
          <div class="info-item"><div class="ilabel">Name</div><div class="ivalue">${name}</div></div>
          <div class="info-item"><div class="ilabel">Email</div><div class="ivalue">${email}</div></div>
          <div class="info-item"><div class="ilabel">Registered Phone</div><div class="ivalue">${phone}</div></div>
          <div class="query-box"><div style="color:#c47f2a;font-size:10px;letter-spacing:1px;text-transform:uppercase;font-weight:700;margin-bottom:6px;">Question Asked</div><div style="color:#4a5568;font-size:14px;">${query}</div></div>
          <p style="font-size:12px;color:#888;margin-top:14px;">Received: ${nowIST()} IST</p>
        </div>
        <div class="footer"><p>Automated message from your portfolio chatbot</p></div>
      </div></body></html>`
    });
    return true;
  } catch (err) {
    console.error('sendCallbackEmail failed:', err.message);
    return false;
  }
}

module.exports = { sendNewChatUserEmail, sendOtpEmail, sendCallbackEmail, getTransporter };
