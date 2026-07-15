import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Profile from '@/pages/Profile';
import Placeholder from '@/pages/Placeholder';
import RoleDashboard from '@/pages/RoleDashboard';
import MyCV from '@/pages/jobseeker/MyCV';
import Documents from '@/pages/jobseeker/Documents';
import ScreeningInterview from '@/pages/jobseeker/ScreeningInterview';
import BrowseJobs from '@/pages/jobseeker/BrowseJobs'
import MyApplications from './pages/jobseeker/MyApplications';
import MyPlacements from './pages/jobseeker/MyPlacements';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <AppShell />,
    children: [
      { path: '/dashboard', element: <RoleDashboard /> },
      { path: '/profile', element: <Profile /> },

      // Job seeker
      { path: '/my-cv', element: <MyCV /> },
      { path: '/interview', element: <ScreeningInterview /> },
      { path: '/documents', element: <Documents /> },
      { path: '/jobs', element: <BrowseJobs /> },
      { path: '/applications', element: <MyApplications /> },
      { path: '/placements', element: <MyPlacements /> },

      // Employer
      { path: '/post-job', element: <Placeholder title="Post a Job" /> },
      { path: '/my-jobs', element: <Placeholder title="My Jobs" /> },
      { path: '/jobs/:jobId/shortlist', element: <Placeholder title="Candidate Shortlist" /> },

      // Admin
      { path: '/accounts', element: <Placeholder title="Accounts" /> },
      { path: '/review-queue', element: <Placeholder title="AI Review Queue" /> },

      { path: '/notifications', element: <Placeholder title="Notifications" /> },

      // Coming soon
      { path: '/cs/:feature', element: <Placeholder title="Coming soon" comingSoon /> },
    ],
  },
  // Unknown routes → landing (public), not dashboard.
  { path: '*', element: <Navigate to="/" replace /> },
]);
