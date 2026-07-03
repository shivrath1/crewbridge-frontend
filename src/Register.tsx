import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ROLES = ['WORKER', 'EMPLOYER', 'TRAINER'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('WORKER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({
        email,
        password,
        role,
        first_name: firstName,
        last_name: lastName,
      });
      navigate('/dashboard');
    } catch {
      setError('Could not create account. The email may already be in use.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{ maxWidth: 360, margin: '4rem auto', fontFamily: 'sans-serif' }}
    >
      <h1 style={{ textAlign: 'center' }}>Create account</h1>
      <form onSubmit={handleSubmit}>
        <label>I am a…</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {ROLES.map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: 8,
                border: role === r ? '2px solid #378ADD' : '1px solid #ccc',
                background: role === r ? '#E6F1FB' : '#fff',
                cursor: 'pointer',
              }}
            >
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ flex: 1 }}>
            <label>First name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 12 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Last name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 12 }}
            />
          </div>
        </div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%', padding: 10 }}
        >
          {submitting ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 12 }}>
        Have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
