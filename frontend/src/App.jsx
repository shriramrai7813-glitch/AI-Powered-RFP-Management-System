import React from 'react';
import CreateRFP from './components/CreateRFP';
import RFPList from './components/RFPList';
import Vendors from './components/Vendors';
import CompareView from './components/CompareView';

export default function App() {
  const [view, setView] = React.useState('create');
  const [selectedRfp, setSelectedRfp] = React.useState(null);

  return (
    <div style={{ padding: 18, fontFamily: 'system-ui' }}>
      <header style={{ display:'flex', gap:12, marginBottom:20 }}>
        <button onClick={() => setView('create')}>Create RFP</button>
        <button onClick={() => setView('rfps')}>RFPs</button>
        <button onClick={() => setView('vendors')}>Vendors</button>
      </header>
      <main>
        {view === 'create' && <CreateRFP />}
        {view === 'rfps' && <RFPList onSelect={(r) => { setSelectedRfp(r); setView('compare'); }} />}
        {view === 'vendors' && <Vendors />}
        {view === 'compare' && selectedRfp && <CompareView rfp={selectedRfp} />}
      </main>
    </div>
  );
}
