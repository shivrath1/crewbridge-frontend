import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface Job {
  id: number;
  role_title: string;
  venue_name: string;
  start_datetime: string;
  duration_hours: number;
  pay_rate: string;
  positions_needed: number;
  filled_count: number;
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-emerald-50 text-emerald-700',
  FILLED: 'bg-blue-50 text-blue-700',
  CLOSED: 'bg-slate-100 text-slate-600',
  CANCELLED: 'bg-red-50 text-red-700',
  EXPIRED: 'bg-slate-100 text-slate-600',
};

export default function AllJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.get('/jobs/').then((r) => r.data).catch(() => []);
      setJobs(data ?? []);
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
      <p className="text-sm text-slate-500">All jobs across the platform ({jobs.length})</p>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Role</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Venue</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Filled</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-t border-slate-50">
                  <td className="px-5 py-3 text-sm font-medium text-slate-800">{j.role_title}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{j.venue_name}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">
                    {new Date(j.start_datetime).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{j.filled_count}/{j.positions_needed}</td>
                  <td className="px-5 py-3">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', STATUS_STYLES[j.status] ?? 'bg-slate-100 text-slate-600')}>
                      {j.status.charAt(0) + j.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
