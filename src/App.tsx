import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Stub from './pages/Stub';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Documents from './pages/Documents';

// Wraps a page in the protected layout shell.
function Page({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <Page>
                <Dashboard />
              </Page>
            }
          />
          <Route
            path="/profile"
            element={
              <Page>
                <Profile />
              </Page>
            }
          />
          <Route
            path="/documents"
            element={
              <Page>
                <Documents />
              </Page>
            }
          />
          <Route
            path="/jobs"
            element={
              <Page>
                <Stub title="Jobs" />
              </Page>
            }
          />
          <Route
            path="/placements"
            element={
              <Page>
                <Stub title="My placements" />
              </Page>
            }
          />
          <Route
            path="/post-job"
            element={
              <Page>
                <Stub title="Post a job" />
              </Page>
            }
          />
          <Route
            path="/applicants"
            element={
              <Page>
                <Stub title="Applicants" />
              </Page>
            }
          />
          <Route
            path="/materials"
            element={
              <Page>
                <Stub title="Materials" />
              </Page>
            }
          />
          <Route
            path="/accounts"
            element={
              <Page>
                <Stub title="Accounts" />
              </Page>
            }
          />
          <Route
            path="/review-queue"
            element={
              <Page>
                <Stub title="AI review queue" />
              </Page>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
