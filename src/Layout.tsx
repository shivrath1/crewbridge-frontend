import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { NAV_BY_ROLE } from './navConfig';

const ROLE_LABELS: Record<string, string> = {
  WORKER: 'Job Seeker',
  EMPLOYER: 'Employer',
  TRAINER: 'Trainer',
  ADMIN: 'Admin',
};

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navItems = user ? (NAV_BY_ROLE[user.role] ?? []) : [];

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid #ddd',
        }}
      >
        <strong>Crewbridge</strong>
        <span style={{ fontSize: 13, color: '#555' }}>
          {user?.first_name || user?.email} ·{' '}
          {user ? ROLE_LABELS[user.role] : ''}{' '}
          <button onClick={logout} style={{ marginLeft: 8 }}>
            Log out
          </button>
        </span>
      </header>

      <nav
        style={{
          display: 'flex',
          gap: 16,
          padding: '10px 20px',
          borderBottom: '1px solid #eee',
          flexWrap: 'wrap',
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: 'none',
              color: location.pathname === item.path ? '#185FA5' : '#333',
              fontWeight: location.pathname === item.path ? 600 : 400,
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
}
