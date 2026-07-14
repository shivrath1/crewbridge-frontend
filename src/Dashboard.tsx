import { useAuth } from './AuthContext';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';

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
      <Card className="max-w-md mt-6">
        <CardHeader>
          <CardTitle>Design system check</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 items-center">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Badge>Verified</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
