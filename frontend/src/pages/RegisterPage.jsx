import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '',
    password: '', password2: '', phone: '', location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (v) => setForm(f => ({ ...f, [key]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) { setError('Passwords do not match'); return; }
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/hairstyles');
    } catch (err) {
      const msgs = Object.values(err).flat();
      setError(msgs[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.deco}>
        <div style={s.decoInner}>
          <div style={s.decoLogo}>✂</div>
          <h2 style={s.decoTitle}>GlowUp</h2>
          <p style={s.decoSub}>Your all-in-one hairstyle & spa booking platform</p>
          <div style={s.steps}>
            {['Create your account', 'Browse hairstyles', 'Find nearby salons', 'Book your appointment'].map((step, i) => (
              <div key={step} style={s.step}>
                <div style={s.stepNum}>{i + 1}</div>
                <span style={s.stepText}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.card}>
        <h1 style={s.title}>Create Account</h1>
        <p style={s.subtitle}>Join thousands of satisfied clients</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.row}>
            <Field label="First Name" value={form.first_name} onChange={set('first_name')} placeholder="Jane" />
            <Field label="Last Name" value={form.last_name} onChange={set('last_name')} placeholder="Doe" />
          </div>
          <Field label="Username" value={form.username} onChange={set('username')} placeholder="janedoe" required />
          <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" required />
          <Field label="Phone" value={form.phone} onChange={set('phone')} placeholder="+1 555 0100" />
          <Field label="Location / City" value={form.location} onChange={set('location')} placeholder="New York, NY" />
          <div style={s.row}>
            <Field label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
            <Field label="Confirm Password" type="password" value={form.password2} onChange={set('password2')} placeholder="••••••••" required />
          </div>

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account? <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div style={{ marginBottom: 16, flex: 1 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--mocha)', marginBottom: 5 }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder} required={required}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 10,
          border: '1.5px solid rgba(201, 168, 140, 0.4)',
          background: 'rgba(250, 247, 242, 0.8)',
          fontSize: 14, color: 'var(--espresso)', outline: 'none',
        }}
      />
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1.4fr',
  },
  deco: {
    background: 'linear-gradient(160deg, #2C1810 0%, #6B4226 60%, #A85D50 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60,
  },
  decoInner: { maxWidth: 340 },
  decoLogo: {
    fontSize: 32, color: 'var(--blush)',
    marginBottom: 8,
  },
  decoTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36, color: '#fff', marginBottom: 12,
  },
  decoSub: { fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 40 },
  steps: { display: 'flex', flexDirection: 'column', gap: 16 },
  step: { display: 'flex', alignItems: 'center', gap: 14 },
  stepNum: {
    width: 28, height: 28, borderRadius: '50%',
    background: 'rgba(242, 203, 191, 0.25)',
    border: '1.5px solid rgba(242, 203, 191, 0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 600, color: 'var(--blush)',
    flexShrink: 0,
  },
  stepText: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  card: {
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '50px 70px',
    animation: 'fadeUp 0.5s ease',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32, fontWeight: 700, color: 'var(--espresso)', marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: 'var(--mocha)', marginBottom: 28, fontWeight: 300 },
  error: {
    background: 'rgba(201, 125, 110, 0.1)', border: '1px solid rgba(201, 125, 110, 0.3)',
    color: 'var(--rose-dark)', padding: '12px 16px', borderRadius: 10, fontSize: 14, marginBottom: 20,
  },
  form: { maxWidth: 480 },
  row: { display: 'flex', gap: 14 },
  btn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, var(--rose), var(--rose-dark))',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(201, 125, 110, 0.3)',
    marginTop: 8,
  },
  footer: { marginTop: 20, fontSize: 14, color: 'var(--mocha)' },
  link: { color: 'var(--rose-dark)', fontWeight: 600, textDecoration: 'none' },
};
