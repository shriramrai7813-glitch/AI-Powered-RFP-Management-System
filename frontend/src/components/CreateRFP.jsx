import React, { useState } from 'react';
import api from '../api';

export default function CreateRFP() {
  const [text, setText] = useState('I need 20 laptops with 16GB RAM and 15 27-inch monitors. Budget $50,000. Delivery within 30 days. Payment net 30. Warranty 1 year.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function create() {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/api/rfps', { description: text });
      setResult(res.data);
    } catch (e) {
      setResult({ error: e.message || 'failed' });
    } finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth:800 }}>
      <h2>Create RFP (Natural language)</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width:'100%', height:120 }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={create} disabled={loading}>{loading ? 'Generating...' : 'Generate RFP'}</button>
      </div>
      <pre style={{ marginTop: 12, whiteSpace:'pre-wrap', background:'#f7f7f7', padding:12 }}>
        {result ? JSON.stringify(result, null, 2) : 'No result yet'}
      </pre>
    </div>
  );
}
