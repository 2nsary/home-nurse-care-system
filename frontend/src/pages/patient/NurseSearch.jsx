import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import NurseCard from '../../components/NurseCard';
import Loader from '../../components/Loader';

export default function NurseSearch() {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState('');
  const [availOnly, setAvailOnly] = useState(false);

  const fetchNurses = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (spec) params.append('specialization', spec);
    if (availOnly) params.append('available', 'true');
    API.get(`/nurses?${params}`).then((r) => setNurses(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNurses(); }, [spec, availOnly]);

  const handleSearch = (e) => { e.preventDefault(); fetchNurses(); };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1>Find a Nurse</h1>
        <p>Browse and book from our network of qualified healthcare professionals.</p>
      </div>

      <div className="card-flat" style={{ marginBottom: 24, padding: 16 }}>
        <form onSubmit={handleSearch} style={s.filters}>
          <input className="form-input" placeholder="Search by name..." value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ flex: '1 1 200px' }} />
          <select className="form-select" value={spec} onChange={(e) => setSpec(e.target.value)} style={{ flex: '0 0 200px' }}>
            <option value="">All Specializations</option>
            <option>General Care</option><option>Elderly Care</option><option>Pediatric Care</option>
            <option>Post-Surgery Care</option><option>Chronic Disease Management</option>
          </select>
          <label style={s.checkbox}>
            <input type="checkbox" checked={availOnly} onChange={(e) => setAvailOnly(e.target.checked)} />
            <span>Available Only</span>
          </label>
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
      </div>

      {loading ? <Loader /> : nurses.length === 0 ? (
        <div className="empty-state"><div className="icon">🔍</div><h3>No nurses found</h3><p>Try adjusting your search filters.</p></div>
      ) : (
        <div className="grid-3 stagger">
          {nurses.map((n) => <NurseCard key={n.nurse_id} nurse={n} />)}
        </div>
      )}
    </div>
  );
}

const s = {
  filters: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  checkbox: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 500, color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap' },
};
