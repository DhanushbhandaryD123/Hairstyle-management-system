import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user && ['/', '/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <span style={styles.brandIcon}>✂</span>
        <span style={styles.brandText}>GlowUp</span>
      </Link>

      {user && (
        <div style={styles.links}>
          <NavLink to="/hairstyles" active={location.pathname === '/hairstyles'}>Hairstyles</NavLink>
          <NavLink to="/salons" active={location.pathname === '/salons'}>Salons & Spas</NavLink>
          <NavLink to="/appointments" active={location.pathname === '/appointments'}>My Bookings</NavLink>
          <div style={styles.userSection}>
            <span style={styles.userName}>Hi, {user.first_name || user.username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}>
      {children}
    </Link>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px', height: 70,
    background: 'rgba(250, 247, 242, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(201, 168, 140, 0.2)',
    position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 2px 20px rgba(44, 24, 16, 0.06)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none',
  },
  brandIcon: {
    fontSize: 24, color: 'var(--rose)',
  },
  brandText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22, fontWeight: 700,
    color: 'var(--espresso)',
    letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex', alignItems: 'center', gap: 8,
  },
  link: {
    textDecoration: 'none',
    color: 'var(--mocha)',
    fontSize: 14, fontWeight: 500,
    padding: '6px 14px', borderRadius: 8,
    transition: 'all 0.2s',
  },
  linkActive: {
    background: 'var(--blush)',
    color: 'var(--rose-dark)',
  },
  userSection: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginLeft: 16,
    paddingLeft: 16,
    borderLeft: '1px solid rgba(201, 168, 140, 0.3)',
  },
  userName: {
    fontSize: 14, color: 'var(--mocha)',
    fontWeight: 500,
  },
  logoutBtn: {
    background: 'none',
    border: '1.5px solid var(--sand)',
    color: 'var(--mocha)',
    padding: '6px 14px', borderRadius: 8,
    fontSize: 13, fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};