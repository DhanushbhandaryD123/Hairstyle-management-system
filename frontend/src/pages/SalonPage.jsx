import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';

const FALLBACK_SALONS = [
  { id: 1, name: 'Luxe Hair Studio', address: '123 Main Street', city: 'New York', phone: '+1-555-0101', rating: 4.8, latitude: 40.7128, longitude: -74.0060, distance: 0.8, image_url: 'https://images.unsplash.com/photo-1560066984-138daaa0e2c5?w=400', opening_time: '09:00:00', closing_time: '20:00:00' },
  { id: 2, name: 'The Mane Event', address: '456 Oak Avenue', city: 'New York', phone: '+1-555-0102', rating: 4.6, latitude: 40.7589, longitude: -73.9851, distance: 1.4, image_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400', opening_time: '10:00:00', closing_time: '19:00:00' },
  { id: 3, name: 'Glamour & Glow Spa', address: '789 Bliss Blvd', city: 'New York', phone: '+1-555-0103', rating: 4.9, latitude: 40.6892, longitude: -73.9442, distance: 2.1, image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400', opening_time: '08:00:00', closing_time: '21:00:00' },
  { id: 4, name: 'Radiant Roots Salon', address: '321 Pine Lane', city: 'Brooklyn', phone: '+1-555-0104', rating: 4.5, latitude: 40.6782, longitude: -73.9442, distance: 3.2, image_url: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=400', opening_time: '09:00:00', closing_time: '18:00:00' },
  { id: 5, name: 'Silk & Scissors', address: '654 Maple Drive', city: 'Queens', phone: '+1-555-0105', rating: 4.7, latitude: 40.7282, longitude: -73.7949, distance: 4.5, image_url: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=400', opening_time: '10:00:00', closing_time: '20:00:00' },
];

export default function SalonPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const hairstyle = state?.hairstyle;

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!hairstyle) { navigate('/hairstyles'); return; }
    // Request location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocationError('Location access denied. Showing all nearby salons.')
      );
    } else {
      setLocationError('Geolocation not supported.');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getSalons(hairstyle?.id, location?.lat, location?.lng)
      .then(data => setSalons(data.results || data))
      .catch(() => setSalons(FALLBACK_SALONS))
      .finally(() => setLoading(false));
  }, [location]);

  const sorted = [...salons].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'distance') return (a.distance || 99) - (b.distance || 99);
    return a.name.localeCompare(b.name);
  });

  const handleContinue = () => {
    const s = salons.find(s => s.id === selected);
    if (s) navigate('/schedule', { state: { hairstyle, salon: s } });
  };

  const stars = (rating) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  return (
    <div style={s.page}>
      {hairstyle && (
        <div style={s.selectedStyle}>
          <img src={hairstyle.image_url} alt={hairstyle.name} style={s.styleThumb} onError={e => e.target.src = 'https://images.unsplash.com/photo-1560066984-138daaa0e2c5?w=200'} />
          <div>
            <div style={s.styleLabel}>Selected Style</div>
            <div style={s.styleName}>{hairstyle.name}</div>
          </div>
          <div style={s.stylePrice}>${parseFloat(hairstyle.price).toFixed(0)}</div>
        </div>
      )}

      <div style={s.header}>
        <div>
          <h1 style={s.title}>Nearby Salons & Spas</h1>
          <p style={s.subtitle}>
            {location ? `📍 Showing salons near your location` : '📍 Finding salons...'}
          </p>
          {locationError && <p style={s.locError}>{locationError}</p>}
        </div>
        {selected && (
          <button onClick={handleContinue} style={s.continueBtn}>Book Appointment →</button>
        )}
      </div>

      <div style={s.sortRow}>
        <span style={{ fontSize: 14, color: 'var(--mocha)' }}>{salons.length} salons found</span>
        <div style={s.sortBtns}>
          {['distance', 'rating', 'name'].map(opt => (
            <button key={opt} onClick={() => setSortBy(opt)}
              style={{ ...s.sortBtn, ...(sortBy === opt ? s.sortBtnActive : {}) }}>
              {opt === 'distance' ? '📍 Distance' : opt === 'rating' ? '⭐ Rating' : '🔤 Name'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={s.list}>
          {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />)}
        </div>
      ) : (
        <div style={s.list}>
          {sorted.map((salon, i) => (
            <div
              key={salon.id}
              onClick={() => setSelected(salon.id === selected ? null : salon.id)}
              style={{
                ...s.card,
                ...(selected === salon.id ? s.cardSelected : {}),
                animationDelay: `${i * 0.07}s`,
              }}
              className="fade-up"
            >
              <img src={salon.image_url} alt={salon.name} style={s.salonImg} onError={e => e.target.src = 'https://images.unsplash.com/photo-1560066984-138daaa0e2c5?w=200'} />
              <div style={s.salonInfo}>
                <div style={s.salonNameRow}>
                  <h3 style={s.salonName}>{salon.name}</h3>
                  {selected === salon.id && <span style={s.checkBadge}>✓ Selected</span>}
                </div>
                <p style={s.salonAddr}>📍 {salon.address}, {salon.city}</p>
                <p style={s.salonPhone}>📞 {salon.phone}</p>
                <div style={s.salonMeta}>
                  <span style={s.stars}>{stars(salon.rating)}</span>
                  <span style={s.ratingNum}>{salon.rating}</span>
                  <span style={s.dot}>·</span>
                  <span style={s.hours}>🕐 {salon.opening_time?.slice(0,5)} – {salon.closing_time?.slice(0,5)}</span>
                </div>
              </div>
              {salon.distance && (
                <div style={s.distBadge}>
                  <div style={s.distNum}>{salon.distance}</div>
                  <div style={s.distUnit}>km</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 900, margin: '0 auto', padding: '40px 40px 60px' },
  selectedStyle: {
    display: 'flex', alignItems: 'center', gap: 16,
    background: 'rgba(242, 203, 191, 0.2)',
    border: '1.5px solid rgba(201, 125, 110, 0.2)',
    borderRadius: 14, padding: '14px 20px', marginBottom: 32,
  },
  styleThumb: { width: 52, height: 52, borderRadius: 10, objectFit: 'cover' },
  styleLabel: { fontSize: 11, fontWeight: 600, color: 'var(--rose)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 },
  styleName: { fontSize: 16, fontWeight: 600, color: 'var(--espresso)' },
  stylePrice: { marginLeft: 'auto', fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: 'var(--rose-dark)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 36, color: 'var(--espresso)', marginBottom: 6 },
  subtitle: { fontSize: 15, color: 'var(--mocha)' },
  locError: { fontSize: 13, color: 'var(--rose)', marginTop: 4 },
  continueBtn: {
    padding: '13px 26px',
    background: 'linear-gradient(135deg, var(--rose), var(--rose-dark))',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(201, 125, 110, 0.3)',
  },
  sortRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sortBtns: { display: 'flex', gap: 8 },
  sortBtn: {
    padding: '7px 14px', borderRadius: 8,
    border: '1.5px solid rgba(201, 168, 140, 0.4)',
    background: 'none', color: 'var(--mocha)',
    fontSize: 13, cursor: 'pointer',
  },
  sortBtnActive: { background: 'var(--espresso)', color: '#fff', borderColor: 'var(--espresso)' },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: {
    display: 'flex', alignItems: 'center', gap: 20,
    background: '#fff', borderRadius: 16,
    border: '2px solid transparent',
    padding: '16px 20px', cursor: 'pointer',
    boxShadow: '0 4px 16px var(--shadow)',
    transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
  },
  cardSelected: {
    borderColor: 'var(--rose)',
    boxShadow: '0 8px 28px rgba(201, 125, 110, 0.2)',
    transform: 'translateX(4px)',
  },
  salonImg: { width: 80, height: 80, borderRadius: 12, objectFit: 'cover', flexShrink: 0 },
  salonInfo: { flex: 1 },
  salonNameRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  salonName: { fontFamily: "'Playfair Display', serif", fontSize: 19, color: 'var(--espresso)' },
  checkBadge: {
    background: 'rgba(201, 125, 110, 0.15)', color: 'var(--rose-dark)',
    padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
  },
  salonAddr: { fontSize: 13, color: 'var(--mocha)', marginBottom: 3 },
  salonPhone: { fontSize: 13, color: 'var(--mocha)', marginBottom: 8 },
  salonMeta: { display: 'flex', alignItems: 'center', gap: 8 },
  stars: { color: 'var(--gold)', fontSize: 14 },
  ratingNum: { fontSize: 13, fontWeight: 600, color: 'var(--espresso)' },
  dot: { color: 'var(--sand)' },
  hours: { fontSize: 13, color: 'var(--mocha)' },
  distBadge: {
    textAlign: 'center',
    background: 'rgba(196, 212, 189, 0.3)',
    borderRadius: 10, padding: '10px 14px',
    flexShrink: 0,
  },
  distNum: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: 'var(--sage)' },
  distUnit: { fontSize: 11, color: 'var(--mocha)', fontWeight: 500 },
};
