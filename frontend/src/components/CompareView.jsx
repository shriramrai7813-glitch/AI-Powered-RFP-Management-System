import React, { useEffect, useState } from 'react';
import api from '../api';

export default function CompareView({ rfp }) {
  const [data, setData] = useState(null);
  useEffect(() => { load(); }, []);

  async function load() {
    const r = await api.get(`/api/proposals/compare/${rfp.id}`);
    setData(r.data);
  }

  if (!data) return <div>Loading...</div>;
  return (
    <div>
      <h2>Compare — {data.rfp.title}</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse:'collapse' }}>
        <thead>
          <tr>
            <th>Vendor</th><th>Price</th><th>Delivery days</th><th>Warranty</th><th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.proposals.map(p => (
            <tr key={p.id}>
              <td>{p.vendor_email}</td>
              <td>{p.parsed?.total?.amount ? `${p.parsed.total.currency || ''} ${p.parsed.total.amount}` : '—'}</td>
              <td>{p.parsed?.delivery_days ?? '—'}</td>
              <td>{p.parsed?.warranty_months ?? '—'}</td>
              <td>{p.score ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
