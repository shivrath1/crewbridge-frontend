import { useAuth } from '@/context/AuthContext';
import JobseekerDashboard from '@/pages/jobseeker/Dashboard';
import AdminDashboard from '@/pages/admin/Dashboard';
import Placeholder from '@/pages/Placeholder';

export default function RoleDashboard() {
  const { user } = useAuth();
  if (user?.role === 'WORKER') return <JobseekerDashboard />;
  if (user?.role === 'ADMIN') return <AdminDashboard />;
  return <Placeholder title="Dashboard" />;
}