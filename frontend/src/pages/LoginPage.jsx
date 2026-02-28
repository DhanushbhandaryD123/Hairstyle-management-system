import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form);
      navigate('/hairstyles');
    } catch (err) {
      setError(err.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.logo}>✂</div>
          <h1 style={s.title}>Welcome Back</h1>
          <p style={s.subtitle}>Sign in to book your next glow-up</p>
        </div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <Field label="Username" value={form.username} onChange={v => setForm(f => ({ ...f, username: v }))} placeholder="your_username" />
          <Field label="Password" type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} placeholder="••••••••" />

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={s.footer}>
          Don't have an account? <Link to="/register" style={s.link}>Create one</Link>
        </p>
      </div>

      <div style={s.deco}>
        <div style={s.decoInner}>
          <p style={s.decoQuote}>"Every great hairstyle starts with a single appointment."</p>
          <div style={s.decoStats}>
            {['💇 500+ Styles', '📍 200+ Salons', '⭐ 4.9 Rating'].map(t => (
              <span key={t} style={s.decoTag}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--mocha)', marginBottom: 6 }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        required
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 10,
          border: '1.5px solid rgba(201, 168, 140, 0.4)',
          background: 'rgba(250, 247, 242, 0.8)',
          fontSize: 15, color: 'var(--espresso)',
          outline: 'none',
        }}
      />
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    background: 'var(--cream)',
  },
  card: {
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '60px 80px',
    animation: 'fadeUp 0.5s ease',
  },
  header: { marginBottom: 36 },
  logo: {
    width: 52, height: 52, borderRadius: 14,
    background: 'linear-gradient(135deg, var(--rose), var(--rose-dark))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, color: '#fff', marginBottom: 20,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36, fontWeight: 700, color: 'var(--espresso)', marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: 'var(--mocha)', fontWeight: 300 },
  error: {
    background: 'rgba(201, 125, 110, 0.1)',
    border: '1px solid rgba(201, 125, 110, 0.3)',
    color: 'var(--rose-dark)',
    padding: '12px 16px', borderRadius: 10,
    fontSize: 14, marginBottom: 20,
  },
  form: { maxWidth: 380 },
  btn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, var(--rose), var(--rose-dark))',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 16, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(201, 125, 110, 0.3)',
    marginTop: 8,
  },
  footer: { marginTop: 24, fontSize: 14, color: 'var(--mocha)' },
  link: { color: 'var(--rose-dark)', fontWeight: 600, textDecoration: 'none' },
  deco: {
    background: 'linear-gradient(160deg, #F2CBBF 0%, #C97D6E 50%, #8B6358 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 60,
  },
  decoInner: { maxWidth: 360 },
  decoQuote: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28, fontStyle: 'italic',
    color: '#fff', lineHeight: 1.4, marginBottom: 40,
    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  decoStats: { display: 'flex', flexDirection: 'column', gap: 12 },
  decoTag: {
    background: 'rgba(255,255,255,0.2)',
    color: '#fff', padding: '10px 18px', borderRadius: 10,
    fontSize: 14, backdropFilter: 'blur(5px)',
  },
};
