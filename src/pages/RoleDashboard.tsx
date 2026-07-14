import { useAuth } from '@/context/AuthContext';
import JobseekerDashboard from '@/pages/jobseeker/Dashboard';
import Placeholder from '@/pages/Placeholder';

export default function RoleDashboard() {
  const { user } = useAuth();
  if (user?.role === 'WORKER') return <JobseekerDashboard />;
  return <Placeholder title="Dashboard" />;
}
