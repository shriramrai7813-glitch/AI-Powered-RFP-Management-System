const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');

// GET /api/vendors
router.get('/', async (req, res) => {
  const r = await db.query('SELECT * FROM vendors ORDER BY name');
  res.json(r.rows);
});

// POST /api/vendors
router.post('/', async (req, res) => {
  const { name, contact_name, email, phone } = req.body;
  const r = await db.query('INSERT INTO vendors (id, name, contact_name, email, phone) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [uuidv4(), name, contact_name, email, phone]);
  res.json(r.rows[0]);
});

// PUT /api/vendors/:id
router.put('/:id', async (req, res) => {
  const { name, contact_name, email, phone } = req.body;
  const r = await db.query('UPDATE vendors SET name=$1, contact_name=$2, email=$3, phone=$4 WHERE id=$5 RETURNING *',
    [name, contact_name, email, phone, req.params.id]);
  res.json(r.rows[0]);
});

// DELETE /api/vendors/:id
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM vendors WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
