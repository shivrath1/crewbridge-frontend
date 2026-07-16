import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Bot, Briefcase, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, flags: 0, jobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { default: api } = await import('@/lib/api');
      const get = (url: string) => api.get(url).then((r) => r.data).catch(() => []);
      const [users, flags, jobs] = await Promise.all([
        get('/admin/users/'),
        get('/admin/review-queue/'),
        get('/jobs/'),
      ]);
      setStats({
        users: users?.length ?? 0,
        flags: flags?.length ?? 0,
        jobs: jobs?.length ?? 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="mr-2 size-5 animate-spin" /> Loading…
      </div>
    );
  }

  const cards = [
    { label: 'Total accounts', value: stats.users, icon: Users, to: '/accounts', color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending reviews', value: stats.flags, icon: Bot, to: '/review-queue', color: 'text-amber-600 bg-amber-50' },
    { label: 'Total jobs', value: stats.jobs, icon: Briefcase, to: '/all-jobs', color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button key={c.label} onClick={() => navigate(c.to)} className="text-left">
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className={`mb-4 flex size-10 items-center justify-center rounded-lg ${c.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{c.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{c.label}</p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
