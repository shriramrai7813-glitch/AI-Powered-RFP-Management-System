const express = require('express');
const router = express.Router();
const db = require('../models/db');
const ai = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');
const scoring = require('../services/scoringService');

// POST /api/emails/webhook
// Expects { from, subject, text, token? } — this endpoint will be called by your inbound email service (SendGrid / Mailgun) or simulated
router.post('/webhook', async (req, res) => {
  try {
    const inboundSecret = process.env.EMAIL_INBOUND_SECRET;
    // Optional simple secret check
    if (inboundSecret && req.headers['x-inbound-secret'] !== inboundSecret) {
      // allow in dev if secret not present
      // return res.status(401).json({ error: 'unauthorized' });
    }

    const { from, subject, text } = req.body;
    // try to extract token from subject or body (pattern TOKEN:XXXX)
    const tokenMatch = (subject + ' ' + (text || '')).match(/TOKEN[:\-\s]*([A-Z0-9]{5,})/i);
    const token = tokenMatch ? tokenMatch[1] : null;

    // find rfp via token in rfp_vendor_links if exists
    let rfpId = null;
    if (token) {
      const r = await db.query('SELECT rfp_id FROM rfp_vendor_links WHERE reply_token=$1 LIMIT 1', [token]);
      if (r.rows[0]) rfpId = r.rows[0].rfp_id;
    }

    // fallback: try to extract RFP-<id> from subject
    if (!rfpId) {
      const idMatch = subject && subject.match(/RFP-([0-9a-fA-F\-]{8,36})/);
      if (idMatch) rfpId = idMatch[1];
    }

    // run AI parser
    const { parsed, text: aiText } = await ai.parseVendorResponse(text || '');

    // store raw email & parsed json
    const proposalId = uuidv4();
    await db.query('INSERT INTO proposals (id, rfp_id, vendor_email, raw_email, parsed, created_at) VALUES ($1,$2,$3,$4,$5,now())',
      [proposalId, rfpId, from, text, parsed]);

    // compute scores for all proposals of this RFP asynchronously (simple)
    const proposalsRes = await db.query('SELECT id, parsed FROM proposals WHERE rfp_id=$1', [rfpId]);
    const proposals = proposalsRes.rows.map(r => ({ id: r.id, parsed: r.parsed }));
    const scored = scoring.computeScoresForProposals(proposals);
    // write scores back
    for (const p of scored) {
      await db.query('UPDATE proposals SET score=$1 WHERE id=$2', [p.score, p.id]);
    }

    res.json({ ok: true, parsed, ai_raw: aiText, rfpId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'inbound_parse_failed', details: e.message });
  }
});

module.exports = router;
