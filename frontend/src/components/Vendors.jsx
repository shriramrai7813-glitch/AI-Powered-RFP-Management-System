import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({ name:'', contact_name:'', email:'', phone:'' });

  useEffect(() => { load(); }, []);
  async function load() {
    const r = await api.get('/api/vendors'); setVendors(r.data);
  }
  async function add() {
    await api.post('/api/vendors', form);
    setForm({ name:'', contact_name:'', email:'', phone:'' });
    load();
  }
  async function remove(id) {
    await api.delete('/api/vendors/' + id); load();
  }

  return (
    <div>
      <h2>Vendors</h2>
      <div style={{ display:'flex', gap:8 }}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Contact" value={form.contact_name} onChange={e=>setForm({...form, contact_name:e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <button onClick={add}>Add</button>
      </div>
      <ul>
        {vendors.map(v => (
          <li key={v.id}>
            {v.name} — {v.email} <button onClick={()=>remove(v.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
