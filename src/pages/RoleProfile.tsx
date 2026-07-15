import { useAuth } from '@/context/AuthContext';
import JobSeekerProfile from '@/pages/jobseeker/Profile';
import EmployerProfile from '@/pages/employer/Profile';
import Placeholder from '@/pages/Placeholder';

export default function RoleProfile() {
  const { user } = useAuth();
  if (user?.role === 'WORKER') return <JobSeekerProfile />;
  if (user?.role === 'EMPLOYER') return <EmployerProfile />;
  return <Placeholder title="My Profile" />;
}
