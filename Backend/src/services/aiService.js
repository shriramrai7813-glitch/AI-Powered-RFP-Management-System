// const axios = require('axios');
// const jsonSafeParse = require('../utils/jsonSafeParse');

// const OPENAI_KEY = process.env.OPENAI_API_KEY;
// if (!OPENAI_KEY) console.warn('OPENAI_API_KEY not set in .env');

// const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

// async function callOpenAI(messages, model='gpt-4.1-mini') {
//   const resp = await axios.post(OPENAI_URL, {
//     model,
//     messages,
//     temperature: 0
//   }, {
//     headers: { Authorization: `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' }
//   });
//   const text = resp.data?.choices?.[0]?.message?.content || '';
//   return { raw: resp.data, text };
// }

// async function extractRfpFromText(nlText) {
//   const system = `You are a procurement assistant. Extract the following JSON strictly:
// {
//   "title": string,
//   "items": [{"name":string,"quantity":int,"specs":string}],
//   "budget": {"amount": number, "currency": string} | null,
//   "delivery_days": int | null,
//   "payment_terms": string | null,
//   "warranty_months": int | null,
//   "notes": string | null
// }
// Return only JSON. If field missing, set null or empty array.`;
//   const messages = [{ role: 'system', content: system }, { role: 'user', content: nlText }];
//   const { text, raw } = await callOpenAI(messages);
//   const parsed = jsonSafeParse(text);
//   return { raw, text, parsed };
// }

// async function parseVendorResponse(rawEmailText) {
//   const system = `You are an extraction assistant. Given an email body and attachment text, return valid JSON:
// {
//   "vendor_name": string | null,
//   "line_items": [{"name":string,"quantity":int,"unit_price":number,"currency":string,"total_price":number,"specs":string}],
//   "subtotal": {"amount":number,"currency":string} | null,
//   "taxes": {"amount":number,"currency":string} | null,
//   "total": {"amount":number,"currency":string} | null,
//   "delivery_days": int | null,
//   "warranty_months": int | null,
//   "payment_terms": string | null,
//   "notes": string | null,
//   "confidence": {"line_items":0-1,"pricing":0-1,"overall":0-1}
// }
// Return only valid JSON. If field missing, return null.`;
//   const messages = [{ role: 'system', content: system }, { role: 'user', content: rawEmailText }];
//   const { text, raw } = await callOpenAI(messages);
//   const parsed = jsonSafeParse(text);
//   return { raw, text, parsed };
// }

// module.exports = { extractRfpFromText, parseVendorResponse };


// backend/src/services/aiService.js
// MOCK AI SERVICE FOR LOCAL DEV (no OpenAI calls)

async function extractRfpFromText(nlText) {
  // Very simple mock parser based on the input text
  // In real deployment, you would call OpenAI here.
  return {
    raw: null,
    text: '',
    parsed: {
      title: 'Laptop & Monitor Procurement',
      items: [
        { name: 'Laptop', quantity: 20, specs: '16GB RAM' },
        { name: 'Monitor', quantity: 15, specs: '27-inch' }
      ],
      budget: { amount: 50000, currency: 'USD' },
      delivery_days: 30,
      payment_terms: 'Net 30',
      warranty_months: 12,
      notes: nlText
    }
  };
}

async function parseVendorResponse(rawEmailText) {
  // Very simple mock: extract some numbers loosely
  // In real deployment, you would call OpenAI here.
  return {
    raw: null,
    text: '',
    parsed: {
      vendor_name: 'Mock Vendor',
      line_items: [
        {
          name: 'Laptop',
          quantity: 20,
          unit_price: 950,
          currency: 'USD',
          total_price: 19000,
          specs: '16GB RAM'
        },
        {
          name: 'Monitor',
          quantity: 15,
          unit_price: 250,
          currency: 'USD',
          total_price: 3750,
          specs: '27-inch'
        }
      ],
      subtotal: { amount: 22750, currency: 'USD' },
      taxes: { amount: 4095, currency: 'USD' },
      total: { amount: 26845, currency: 'USD' },
      delivery_days: 25,
      warranty_months: 12,
      payment_terms: 'Net 30',
      notes: 'Mock parsed from email',
      confidence: { line_items: 0.9, pricing: 0.9, overall: 0.9 }
    }
  };
}

module.exports = { extractRfpFromText, parseVendorResponse };
