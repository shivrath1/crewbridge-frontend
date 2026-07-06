import { useAuth } from '../context/AuthContext';

const LANDING_BY_ROLE: Record<string, string> = {
  WORKER:
    'Find and apply for jobs, manage your documents and track your applications.',
  EMPLOYER:
    'Post jobs, review applicants and hire work-ready hospitality staff.',
  TRAINER: 'Manage your training programmes and learner progress.',
  ADMIN: 'Manage users, review AI reports and oversee the CrewBridge platform.',
};

const ROLE_ACTIONS: Record<string, string[]> = {
  WORKER: [
    'Browse Jobs',
    'Upload Documents',
    'Complete Profile',
    'View Applications',
  ],
  EMPLOYER: ['Post New Job', 'Review Applicants', 'Manage Jobs', 'AI Matching'],
  TRAINER: [
    'Manage Courses',
    'Upload Resources',
    'View Students',
    'Certificates',
  ],
  ADMIN: [
    'Manage Users',
    'Moderation',
    'Platform Analytics',
    'System Settings',
  ],
};

export default function Dashboard() {
  const { user } = useAuth();

  const firstName = user?.first_name || user?.email?.split('@')[0] || 'User';

  const role = user?.role ?? 'WORKER';

  const message = LANDING_BY_ROLE[role];

  const actions = ROLE_ACTIONS[role] ?? [];

  return (
    <div
      style={{
        background: '#F5F8FC',
        minHeight: '100vh',
        padding: '40px',
      }}
    >
      {/* HERO */}

      <div
        style={{
          background:
            'linear-gradient(135deg,#172554 0%, #1E3A8A 50%, #2563EB 100%)',
          borderRadius: 24,
          color: 'white',
          padding: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 40,
          marginBottom: 35,
          boxShadow: '0 15px 45px rgba(0,0,0,.15)',
        }}
      >
        <div style={{ maxWidth: 600 }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              borderRadius: 999,
              background: 'rgba(255,255,255,.12)',
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            ⚡ AI Powered Workforce Platform
          </div>

          <h1
            style={{
              fontSize: 42,
              marginBottom: 18,
              lineHeight: 1.2,
            }}
          >
            Welcome back,
            <br />
            {firstName}
          </h1>

          <p
            style={{
              fontSize: 18,
              opacity: 0.9,
              maxWidth: 520,
            }}
          >
            {message}
          </p>
        </div>

        {/* AI CARD */}

        <div
          style={{
            background: 'white',
            color: '#111',
            width: 330,
            borderRadius: 20,
            padding: 25,
          }}
        >
          <h3
            style={{
              marginBottom: 25,
              color: '#2563EB',
            }}
          >
            AI Workforce Summary
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 15,
            }}
          >
            <Stat title="Jobs" value="12" />

            <Stat title="Matches" value="48" />

            <Stat title="Success" value="96%" />

            <Stat title="Status" value="Online" />
          </div>
        </div>
      </div>

      {/* STATS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: 20,
          marginBottom: 35,
        }}
      >
        <DashboardCard title="Applications" value="18" colour="#2563EB" />

        <DashboardCard
          title="Profile Completion"
          value="92%"
          colour="#06B6D4"
        />

        <DashboardCard title="Documents" value="8" colour="#22C55E" />

        <DashboardCard title="AI Score" value="96%" colour="#14B8A6" />
      </div>

      {/* CONTENT */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 25,
        }}
      >
        {/* LEFT */}

        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 30,
            boxShadow: '0 8px 20px rgba(0,0,0,.06)',
          }}
        >
          <h2>Quick Actions</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
              gap: 20,
              marginTop: 25,
            }}
          >
            {actions.map((action) => (
              <button
                key={action}
                style={{
                  background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
                  color: 'white',
                  border: 'none',
                  padding: '18px',
                  borderRadius: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: '.2s',
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}

        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 30,
            boxShadow: '0 8px 20px rgba(0,0,0,.06)',
          }}
        >
          <h2>Recent Activity</h2>

          <Activity title="Profile updated" time="Today" />

          <Activity title="AI Match refreshed" time="2 hours ago" />

          <Activity title="Document verified" time="Yesterday" />

          <Activity title="Welcome to CrewBridge" time="This week" />
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  colour: string;
}

function DashboardCard({ title, value, colour }: DashboardCardProps) {
  return (
    <div
      style={{
        background: 'white',
        padding: 24,
        borderRadius: 18,
        boxShadow: '0 5px 18px rgba(0,0,0,.06)',
      }}
    >
      <p
        style={{
          color: '#666',
          marginBottom: 8,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          color: colour,
          fontSize: 34,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

interface StatProps {
  title: string;
  value: string;
}

function Stat({ title, value }: StatProps) {
  return (
    <div
      style={{
        background: '#F8FAFC',
        padding: 15,
        borderRadius: 12,
      }}
    >
      <small>{title}</small>

      <h2
        style={{
          marginTop: 5,
          color: '#2563EB',
        }}
      >
        {value}
      </h2>
    </div>
  );
}

interface ActivityProps {
  title: string;
  time: string;
}

function Activity({ title, time }: ActivityProps) {
  return (
    <div
      style={{
        padding: '18px 0',
        borderBottom: '1px solid #eee',
      }}
    >
      <strong>{title}</strong>

      <p
        style={{
          color: '#777',
          marginTop: 5,
        }}
      >
        {time}
      </p>
    </div>
  );
}
