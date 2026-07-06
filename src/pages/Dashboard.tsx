import { useAuth } from '../context/AuthContext';

const LANDING_BY_ROLE: Record<string, string> = {
  WORKER: 'Find and apply for jobs, and manage your profile and documents.',
  EMPLOYER: 'Post jobs, review applicants, and manage your venue.',
  TRAINER: 'Manage your profile and training materials.',
  ADMIN: 'Manage accounts and review AI-flagged items.',
};

export default function Dashboard() {
  const { user } = useAuth();
  const message = user ? LANDING_BY_ROLE[user.role] : '';

  return (
    <div>
      <h2>Welcome, {user?.first_name || user?.email}</h2>
      <p style={{ color: '#666' }}>{message}</p>
      <p style={{ fontSize: 13, color: '#999' }}>
        Use the navigation above to get started.
      </p>
    </div>
  );
}
