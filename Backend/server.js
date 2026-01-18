require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const rfpRouter = require('./src/controllers/rfpController');
const vendorRouter = require('./src/controllers/vendorController');
const emailRouter = require('./src/controllers/emailController');
const proposalRouter = require('./src/controllers/proposalController');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.use('/api/rfps', rfpRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/emails', emailRouter);
app.use('/api/proposals', proposalRouter);

app.get('/', (req, res) => res.send({ ok: true, msg: 'AI RFP Backend' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
