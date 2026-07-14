import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Placeholder from '@/pages/Placeholder';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <AppShell />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/profile', element: <Profile /> },

      // Job seeker
      { path: '/my-cv', element: <Placeholder title="My CV" /> },
      {
        path: '/interview',
        element: <Placeholder title="Screening Interview" />,
      },
      { path: '/documents', element: <Placeholder title="Documents" /> },
      { path: '/jobs', element: <Placeholder title="Browse Jobs" /> },
      {
        path: '/applications',
        element: <Placeholder title="My Applications" />,
      },
      { path: '/placements', element: <Placeholder title="Placements" /> },

      // Employer
      { path: '/post-job', element: <Placeholder title="Post a Job" /> },
      { path: '/my-jobs', element: <Placeholder title="My Jobs" /> },
      {
        path: '/jobs/:jobId/shortlist',
        element: <Placeholder title="Candidate Shortlist" />,
      },

      // Admin
      { path: '/accounts', element: <Placeholder title="Accounts" /> },
      {
        path: '/review-queue',
        element: <Placeholder title="AI Review Queue" />,
      },

      {
        path: '/notifications',
        element: <Placeholder title="Notifications" />,
      },

      // Coming soon
      {
        path: '/cs/:feature',
        element: <Placeholder title="Coming soon" comingSoon />,
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
