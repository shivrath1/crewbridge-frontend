import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Stub from './Stub';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute';
import Profile from './Profile';

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
                <Stub title="Documents" />
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
