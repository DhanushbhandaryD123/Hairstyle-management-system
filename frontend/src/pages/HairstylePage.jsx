import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const FALLBACK_HAIRSTYLES = [
  { id: 1, name: 'Pixie Cut', category_name: 'Short', description: 'Chic short tapered cut', duration_minutes: 30, price: '50.00', image_url: 'https://images.unsplash.com/photo-1620122830785-a40d0d2b4f96?w=400' },
  { id: 2, name: 'Bob Cut', category_name: 'Short', description: 'Classic chin-length bob', duration_minutes: 45, price: '65.00', image_url: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400' },
  { id: 3, name: 'Beach Waves', category_name: 'Medium', description: 'Effortless tousled texture', duration_minutes: 60, price: '75.00', image_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400' },
  { id: 4, name: 'Layered Bob', category_name: 'Medium', description: 'Modern bob with soft layers', duration_minutes: 60, price: '80.00', image_url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400' },
  { id: 5, name: 'Balayage', category_name: 'Long', description: 'Sun-kissed painted highlights', duration_minutes: 180, price: '220.00', image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400' },
  { id: 6, name: 'Mermaid Waves', category_name: 'Long', description: 'Voluminous flowing waves', duration_minutes: 90, price: '120.00', image_url: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400' },
  { id: 7, name: 'Spiral Curls', category_name: 'Curly', description: 'Defined bouncy spiral curls', duration_minutes: 75, price: '95.00', image_url: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=400' },
  { id: 8, name: 'Bridal Updo', category_name: 'Special Occasion', description: 'Elegant pinned updo', duration_minutes: 120, price: '180.00', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400' },
  { id: 9, name: 'French Braid', category_name: 'Special Occasion', description: 'Classic French braid', duration_minutes: 45, price: '60.00', image_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400' },
  { id: 10, name: 'Highlights', category_name: 'Color', description: 'Multi-tonal foil highlights', duration_minutes: 150, price: '195.00', image_url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400' },
];

export default function HairstylePage() {
  const [hairstyles, setHairstyles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getHairstyles(), api.getCategories()])
      .then(([hs, cats]) => {
        setHairstyles(hs.results || hs);
        setCategories(cats.results || cats);
      })
      .catch(() => {
        setHairstyles(FALLBACK_HAIRSTYLES);
        setCategories([
          { id: 1, name: 'Short' }, { id: 2, name: 'Medium' },
          { id: 3, name: 'Long' }, { id: 4, name: 'Curly' },
          { id: 5, name: 'Color' }, { id: 6, name: 'Special Occasion' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = hairstyles.filter(h =>
    (activeCategory === 'All' || h.category_name === activeCategory) &&
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (hairstyle) => {
    setSelected(hairstyle.id === selected ? null : hairstyle.id);
  };

  const handleContinue = () => {
    const s = hairstyles.find(h => h.id === selected);
    if (s) navigate('/salons', { state: { hairstyle: s } });
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Choose Your Style</h1>
          <p style={s.subtitle}>Select a hairstyle that speaks to you</p>
        </div>
        {selected && (
          <button onClick={handleContinue} style={s.continueBtn}>
            Find Salons →
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search hairstyles..."
          style={s.search}
        />
        <div style={s.cats}>
          {['All', ...categories.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ ...s.catBtn, ...(activeCategory === cat ? s.catBtnActive : {}) }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={s.grid}>
          {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 20 }} />)}
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((h, i) => (
            <div
              key={h.id}
              onClick={() => handleSelect(h)}
              style={{
                ...s.card,
                ...(selected === h.id ? s.cardSelected : {}),
                animationDelay: `${i * 0.05}s`,
              }}
              className="fade-up"
            >
              <div style={s.imgWrap}>
                <img src={h.image_url} alt={h.name} style={s.img} onError={e => e.target.src = 'https://images.unsplash.com/photo-1560066984-138daaa0e2c5?w=400'} />
                {selected === h.id && <div style={s.checkBadge}>✓</div>}
              </div>
              <div style={s.cardBody}>
                <div style={s.catTag}>{h.category_name}</div>
                <h3 style={s.cardTitle}>{h.name}</h3>
                <p style={s.cardDesc}>{h.description}</p>
                <div style={s.cardMeta}>
                  <span style={s.metaItem}>⏱ {h.duration_minutes} min</span>
                  <span style={s.price}>${parseFloat(h.price).toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div style={s.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💇</div>
          <p>No hairstyles found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '40px 40px 60px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 38, color: 'var(--espresso)', marginBottom: 6 },
  subtitle: { fontSize: 16, color: 'var(--mocha)', fontWeight: 300 },
  continueBtn: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, var(--rose), var(--rose-dark))',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(201, 125, 110, 0.3)',
    animation: 'fadeIn 0.3s ease',
  },
  filters: { marginBottom: 32 },
  search: {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '1.5px solid rgba(201, 168, 140, 0.4)',
    background: '#fff', fontSize: 14, outline: 'none',
    color: 'var(--espresso)', marginBottom: 16,
  },
  cats: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  catBtn: {
    padding: '7px 18px', borderRadius: 20,
    border: '1.5px solid rgba(201, 168, 140, 0.4)',
    background: 'none', color: 'var(--mocha)',
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
  },
  catBtnActive: {
    background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 24,
  },
  card: {
    background: '#fff', borderRadius: 20,
    border: '2px solid transparent',
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 4px 16px var(--shadow)',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
  },
  cardSelected: {
    borderColor: 'var(--rose)',
    boxShadow: '0 8px 30px rgba(201, 125, 110, 0.25)',
    transform: 'translateY(-3px)',
  },
  imgWrap: { position: 'relative', height: 200, overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  checkBadge: {
    position: 'absolute', top: 12, right: 12,
    width: 32, height: 32, borderRadius: '50%',
    background: 'var(--rose)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 700,
  },
  cardBody: { padding: '18px 20px' },
  catTag: {
    display: 'inline-block',
    background: 'rgba(242, 203, 191, 0.4)',
    color: 'var(--rose-dark)',
    padding: '3px 10px', borderRadius: 6,
    fontSize: 12, fontWeight: 500, marginBottom: 8,
  },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, color: 'var(--espresso)', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: 'var(--mocha)', lineHeight: 1.5, marginBottom: 12 },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  metaItem: { fontSize: 13, color: 'var(--mocha)' },
  price: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: 'var(--rose-dark)' },
  empty: { textAlign: 'center', padding: '80px 20px', color: 'var(--mocha)', fontSize: 16 },
};
