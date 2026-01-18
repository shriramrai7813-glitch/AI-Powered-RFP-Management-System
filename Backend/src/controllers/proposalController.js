const express = require('express');
const router = express.Router();
const db = require('../models/db');
const scoring = require('../services/scoringService');

// GET /api/proposals/:rfpId/compare
router.get('/compare/:rfpId', async (req, res) => {
  const { rfpId } = req.params;
  const rfpRes = await db.query('SELECT id, title, structured FROM rfps WHERE id=$1', [rfpId]);
  if (!rfpRes.rows[0]) return res.status(404).json({ error: 'rfp_not_found' });

  const proposalsRes = await db.query('SELECT id, vendor_email, parsed, score, created_at FROM proposals WHERE rfp_id=$1 ORDER BY score DESC NULLS LAST', [rfpId]);
  const proposals = proposalsRes.rows;
  // compute scores if missing
  const toScore = proposals.map(p => ({ id: p.id, parsed: p.parsed }));
  const scored = scoring.computeScoresForProposals(toScore);
  // map scores into proposals
  const merged = proposals.map(p => {
    const s = scored.find(x => x.id === p.id);
    return { ...p, score: s ? s.score : p.score || 0 };
  });
  res.json({ rfp: rfpRes.rows[0], proposals: merged });
});

module.exports = router;
