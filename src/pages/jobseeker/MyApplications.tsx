import { useEffect, useState } from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface Application {
  id: number;
  job_title: string;
  venue_name: string;
  job_start: string;
  status: string;
  applied_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  APPLIED: 'bg-blue-50 text-blue-700',
  SHORTLISTED: 'bg-emerald-50 text-emerald-700',
  ACCEPTED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-700',
  WITHDRAWN: 'bg-slate-100 text-slate-600',
};

function label(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

export default function MyApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api
        .get('/applications/')
        .then((r) => r.data)
        .catch(() => []);
      setApps(data ?? []);
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

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {apps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <ClipboardList className="size-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">
              No applications yet
            </p>
            <p className="text-sm text-slate-400">
              Browse jobs and hit Apply to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-800">
                Your applications
              </h2>
              <p className="text-sm text-slate-400">
                {apps.length} application{apps.length !== 1 ? 's' : ''}
              </p>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                    Role
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                    Venue
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                    Shift date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr
                    key={app.id}
                    className="border-t border-slate-50 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3 text-sm font-medium text-slate-800">
                      {app.job_title}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">
                      {app.venue_name}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">
                      {new Date(app.job_start).toLocaleDateString('en-NZ', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-medium',
                          STATUS_STYLES[app.status] ??
                            'bg-slate-100 text-slate-600'
                        )}
                      >
                        {label(app.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
