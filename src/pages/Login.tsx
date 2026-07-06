import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{ maxWidth: 360, margin: '4rem auto', fontFamily: 'sans-serif' }}
    >
      <h1 style={{ textAlign: 'center' }}>Crewbridge</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Log in to your account
      </p>
      <form onSubmit={handleSubmit}>
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
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%', padding: 10 }}
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 12 }}>
        No account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}
