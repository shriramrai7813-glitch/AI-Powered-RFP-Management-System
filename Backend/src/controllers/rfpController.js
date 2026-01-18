const express = require('express');
const router = express.Router();
const db = require('../models/db');
const ai = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');
const emailService = require('../services/emailService');

// POST /api/rfps  -> create RFP by NL text
router.post('/', async (req, res) => {
  try {
    const { description, title } = req.body;
    const { parsed, raw } = await ai.extractRfpFromText(description);
    // fallback title if none
    const finalTitle = title || (parsed && parsed.title) || 'RFP ' + new Date().toISOString();
    const id = uuidv4();
    const insert = await db.query(
      'INSERT INTO rfps (id, title, description, structured) VALUES ($1,$2,$3,$4) RETURNING *',
      [id, finalTitle, description, parsed]
    );
    res.json({ rfp: insert.rows[0], ai_raw: raw });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_create_rfp', details: e.message });
  }
});

// GET /api/rfps
router.get('/', async (req, res) => {
  const r = await db.query('SELECT id, title, description, structured, created_at FROM rfps ORDER BY created_at DESC');
  res.json(r.rows);
});

// GET /api/rfps/:id
router.get('/:id', async (req, res) => {
  const r = await db.query('SELECT * FROM rfps WHERE id=$1', [req.params.id]);
  if (!r.rows[0]) return res.status(404).json({ error: 'not_found' });
  // load proposals for this rfp
  const proposals = await db.query('SELECT * FROM proposals WHERE rfp_id=$1 ORDER BY created_at DESC', [req.params.id]);
  res.json({ rfp: r.rows[0], proposals: proposals.rows });
});

// POST /api/rfps/:id/send  -> send RFP to vendor ids
router.post('/:id/send', async (req, res) => {
  const { vendorIds } = req.body; // array of vendor ids
  if (!Array.isArray(vendorIds) || vendorIds.length === 0) return res.status(400).json({ error: 'no_vendors' });

  const rfpRow = await db.query('SELECT * FROM rfps WHERE id=$1', [req.params.id]);
  if (!rfpRow.rows[0]) return res.status(404).json({ error: 'rfp_not_found' });
  const rfp = rfpRow.rows[0];

  // generate short token for reply matching
  const shortToken = (Math.random().toString(36).slice(2, 9)).toUpperCase();

  const vendorsRes = await db.query('SELECT * FROM vendors WHERE id = ANY($1::uuid[])', [vendorIds]);
  const vendors = vendorsRes.rows;

  const sendResults = [];
  for (const v of vendors) {
    try {
      const subject = `RFP-${rfp.id} | Please submit proposal (TOKEN:${shortToken})`;
      const html = emailService.buildRfpEmailHtml({ rfp, shortToken });
      const ok = await emailService.sendRfpEmail({ to: v.email, subject, html });
      // record sent link
      await db.query('INSERT INTO rfp_vendor_links (id, rfp_id, vendor_id, sent_at, reply_token, status) VALUES ($1,$2,$3,now(),$4,$5)',
        [uuidv4(), rfp.id, v.id, shortToken, ok ? 'sent' : 'failed']);
      sendResults.push({ vendor: v.email, ok });
    } catch (e) {
      console.error(e);
      sendResults.push({ vendor: v.email, ok: false, error: e.message });
    }
  }
  res.json({ results: sendResults });
});

module.exports = router;
