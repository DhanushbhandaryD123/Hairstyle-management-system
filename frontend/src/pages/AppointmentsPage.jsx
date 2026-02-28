import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const STATUS_COLORS = {
  pending: { bg: 'rgba(201,168,76,0.15)', color: '#9B7800', label: '⏳ Pending' },
  confirmed: { bg: 'rgba(139,158,126,0.2)', color: '#4E6E40', label: '✓ Confirmed' },
  completed: { bg: 'rgba(107,66,38,0.1)', color: 'var(--mocha)', label: '✓ Completed' },
  cancelled: { bg: 'rgba(201,125,110,0.15)', color: 'var(--rose-dark)', label: '✕ Cancelled' },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const load = () => {
    api.getAppointments()
      .then(data => setAppointments(data.results || data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await api.cancelAppointment(id);
      load();
    } catch {}
  };

  const filtered = appointments.filter(a =>
    filter === 'all' || a.status === filter
  );

  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status)).length;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>My Bookings</h1>
          <p style={s.subtitle}>{upcoming > 0 ? `${upcoming} upcoming appointment${upcoming > 1 ? 's' : ''}` : 'No upcoming appointments'}</p>
        </div>
        <button onClick={() => navigate('/hairstyles')} style={s.newBtn}>+ New Booking</button>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        {[
          { label: 'Total', count: appointments.length, color: 'var(--espresso)' },
          { label: 'Upcoming', count: appointments.filter(a => ['pending','confirmed'].includes(a.status)).length, color: 'var(--sage)' },
          { label: 'Completed', count: appointments.filter(a => a.status === 'completed').length, color: 'var(--mocha)' },
          { label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length, color: 'var(--rose)' },
        ].map(stat => (
          <div key={stat.label} style={s.statCard}>
            <div style={{ ...s.statCount, color: stat.color }}>{stat.count}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={s.filterRow}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 8 }}>No appointments yet</h3>
          <p style={{ color: 'var(--mocha)', marginBottom: 24 }}>Book your first hairstyle appointment!</p>
          <button onClick={() => navigate('/hairstyles')} style={s.emptyBtn}>Browse Hairstyles →</button>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map((apt, i) => {
            const st = STATUS_COLORS[apt.status] || STATUS_COLORS.pending;
            const isPast = new Date(apt.appointment_date) < new Date();
            return (
              <div key={apt.id} style={{ ...s.card, animationDelay: `${i * 0.06}s` }} className="fade-up">
                <div style={s.cardLeft}>
                  <div style={s.dateBlock}>
                    <div style={s.dateDay}>{new Date(apt.appointment_date + 'T00:00').getDate()}</div>
                    <div style={s.dateMon}>{new Date(apt.appointment_date + 'T00:00').toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div style={s.dateYear}>{new Date(apt.appointment_date + 'T00:00').getFullYear()}</div>
                  </div>
                  <div style={{ width: 1, background: 'rgba(201, 168, 140, 0.3)', margin: '0 4px' }} />
                </div>
                <div style={s.cardBody}>
                  <div style={s.cardTopRow}>
                    <h3 style={s.aptTitle}>{apt.hairstyle_name}</h3>
                    <span style={{ ...s.statusBadge, background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                  <p style={s.salonLine}>✂ {apt.salon_name}</p>
                  <p style={s.addrLine}>📍 {apt.salon_address}</p>
                  <div style={s.cardMeta}>
                    <span style={s.timeChip}>🕐 {apt.appointment_time?.slice(0,5)}</span>
                    <span style={s.priceChip}>💰 ${parseFloat(apt.total_price || 0).toFixed(0)}</span>
                  </div>
                </div>
                {!isPast && ['pending', 'confirmed'].includes(apt.status) && (
                  <button onClick={() => handleCancel(apt.id)} style={s.cancelBtn}>Cancel</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 800, margin: '0 auto', padding: '40px 40px 60px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 36, color: 'var(--espresso)', marginBottom: 6 },
  subtitle: { fontSize: 15, color: 'var(--mocha)' },
  newBtn: {
    padding: '12px 22px', background: 'var(--espresso)',
    color: 'var(--cream)', border: 'none', borderRadius: 12,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  statCard: {
    background: '#fff', borderRadius: 14, padding: '18px 20px',
    boxShadow: '0 4px 16px var(--shadow)', textAlign: 'center',
  },
  statCount: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 4 },
  statLabel: { fontSize: 13, color: 'var(--mocha)' },
  filterRow: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  filterBtn: {
    padding: '7px 16px', borderRadius: 8,
    border: '1.5px solid rgba(201, 168, 140, 0.4)',
    background: 'none', color: 'var(--mocha)',
    fontSize: 13, cursor: 'pointer',
  },
  filterBtnActive: { background: 'var(--espresso)', color: 'var(--cream)', borderColor: 'var(--espresso)' },
  list: { display: 'flex', flexDirection: 'column', gap: 14 },
  card: {
    background: '#fff', borderRadius: 16, padding: '20px 24px',
    display: 'flex', alignItems: 'center', gap: 20,
    boxShadow: '0 4px 16px var(--shadow)',
    border: '1px solid rgba(201, 168, 140, 0.15)',
  },
  cardLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  dateBlock: { textAlign: 'center', minWidth: 42 },
  dateDay: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: 'var(--espresso)', lineHeight: 1 },
  dateMon: { fontSize: 12, fontWeight: 600, color: 'var(--rose)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  dateYear: { fontSize: 11, color: 'var(--mocha)' },
  cardBody: { flex: 1 },
  cardTopRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  aptTitle: { fontFamily: "'Playfair Display', serif", fontSize: 17, color: 'var(--espresso)' },
  statusBadge: { padding: '3px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500 },
  salonLine: { fontSize: 13, color: 'var(--mocha)', marginBottom: 2 },
  addrLine: { fontSize: 12, color: 'var(--sand)', marginBottom: 8 },
  cardMeta: { display: 'flex', gap: 10 },
  timeChip: {
    background: 'rgba(196, 212, 189, 0.3)', color: 'var(--sage)',
    padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
  },
  priceChip: {
    background: 'rgba(242, 203, 191, 0.3)', color: 'var(--rose-dark)',
    padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
  },
  cancelBtn: {
    padding: '8px 16px', borderRadius: 8,
    border: '1.5px solid rgba(201, 125, 110, 0.4)',
    background: 'none', color: 'var(--rose-dark)',
    fontSize: 13, cursor: 'pointer', flexShrink: 0,
  },
  empty: {
    textAlign: 'center', padding: '80px 20px',
    color: 'var(--espresso)',
  },
  emptyBtn: {
    padding: '13px 28px',
    background: 'linear-gradient(135deg, var(--rose), var(--rose-dark))',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
  },
};
