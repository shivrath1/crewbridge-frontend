import { useAuth } from './AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div
      style={{ maxWidth: 480, margin: '4rem auto', fontFamily: 'sans-serif' }}
    >
      <h1>Crewbridge</h1>
      <p>
        Welcome, {user?.first_name || user?.email}. You are logged in as{' '}
        <strong>{user?.role}</strong>.
      </p>
      <p style={{ color: '#666' }}>
        This is a placeholder dashboard. Role-specific screens come next.
      </p>
      <button onClick={logout} style={{ padding: 10 }}>
        Log out
      </button>
    </div>
  );
}
