import { useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface Placement {
  id: number;
  job_title: string;
  venue_name: string;
  job_start: string;
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: 'bg-emerald-50 text-emerald-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

function label(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

export default function MyPlacements() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.get('/placements/').then((r) => r.data).catch(() => []);
      setPlacements(data ?? []);
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
      {placements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <MapPin className="size-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No placements yet</p>
            <p className="text-sm text-slate-400">Confirmed placements will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-800">Confirmed placements</h2>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Venue</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Date &amp; time</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((p) => (
                  <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{p.job_title}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{p.venue_name}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">
                      {new Date(p.job_start).toLocaleString('en-NZ', {
                        day: 'numeric',
                        month: 'short',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-medium',
                          STATUS_STYLES[p.status] ?? 'bg-slate-100 text-slate-600',
                        )}
                      >
                        {label(p.status)}
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
