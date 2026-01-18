const axios = require('axios');
const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || 'no-reply@yourorg.com';

async function sendRfpEmail({ to, subject, html }) {
  if (!SENDGRID_KEY) throw new Error('SENDGRID_API_KEY not set');
  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: FROM_EMAIL },
    subject,
    content: [{ type: 'text/html', value: html }]
  };
  const resp = await axios.post('https://api.sendgrid.com/v3/mail/send', body, {
    headers: { Authorization: `Bearer ${SENDGRID_KEY}`, 'Content-Type': 'application/json' }
  });
  return resp.status === 202 || resp.status === 200;
}

function buildRfpEmailHtml({ rfp, shortToken }) {
  const itemsHtml = (rfp.structured?.items || []).map(i => `<li>${i.quantity} × ${i.name} — ${i.specs || ''}</li>`).join('');
  return `
    <p>Hello,</p>
    <p>Please find our RFP <strong>${rfp.title || 'RFP'}</strong> below and reply to this email with your proposal. Reference token: <strong>${shortToken}</strong></p>
    <ul>${itemsHtml}</ul>
    <p>Budget: ${rfp.structured?.budget ? (rfp.structured.budget.currency + ' ' + rfp.structured.budget.amount) : 'Not specified'}</p>
    <p>Delivery required in: ${rfp.structured?.delivery_days || 'N/A'} days</p>
    <p>Reply to this email and include the token <strong>${shortToken}</strong> in the subject or body so we can match your reply.</p>
    <p>Thanks</p>
  `;
}

module.exports = { sendRfpEmail, buildRfpEmailHtml };
