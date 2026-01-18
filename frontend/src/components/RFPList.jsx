import React, { useEffect, useState } from 'react';
import api from '../api';

export default function RFPList({ onSelect }) {
  const [rfps, setRfps] = useState([]);
  useEffect(() => { load(); }, []);
  async function load() {
    const r = await api.get('/api/rfps'); setRfps(r.data);
  }

  return (
    <div>
      <h2>RFPs</h2>
      <ul>
        {rfps.map(r => (
          <li key={r.id} style={{ marginBottom:10 }}>
            <strong>{r.title}</strong> — {new Date(r.created_at).toLocaleString()} <br />
            <button onClick={() => onSelect(r)}>Compare proposals</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
