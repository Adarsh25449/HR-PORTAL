
const nodemailer = require('nodemailer');

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
} = process.env;


const transporter = nodemailer.createTransport({
  host: EMAIL_HOST || 'smtp.gmail.com',
  port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
  secure: EMAIL_SECURE === 'true' || EMAIL_SECURE === true, 
  auth: EMAIL_USER && EMAIL_PASS ? { user: EMAIL_USER, pass: EMAIL_PASS } : undefined,
});


transporter.verify().then(() => {
  console.log('✅ Email transporter ready');
}).catch((err) => {
  console.error('⚠️ Email transporter verification failed:', err && err.message ? err.message : err);
});


async function sendEmail(to, subject, html = null, text = null) {
  if (!transporter) throw new Error('No email transporter configured');

  const from = EMAIL_FROM || EMAIL_USER;
  const mailOptions = {
    from,
    to,
    subject,
    text: text || (html ? html.replace(/<\/?[^>]+(>|$)/g, "") : undefined),
    html: html || undefined,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId || info.response || ''}`);
    return info;
  } catch (err) {
    console.error('❌ sendEmail error:', err && err.message ? err.message : err);
   
    throw err;
  }
}

module.exports = sendEmail;

