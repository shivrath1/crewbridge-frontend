import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Loader2, Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface Job {
  id: number;
  role_title: string;
  start_datetime: string;
  duration_hours: number;
  pay_rate: string;
  positions_needed: number;
  positions_remaining: number;
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

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [cancelMsg, setCancelMsg] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);


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

  async function doCancel(id: number) {
    setConfirmId(null);
    setCancelling(id);
    setCancelMsg('');
    try {
      await api.post(`/jobs/${id}/cancel/`);
      const data = await api.get('/jobs/').then((r) => r.data).catch(() => []);
      setJobs(data ?? []);
    } catch (e) {
      const detail =
        (e as { response?: { data?: { detail?: string } } }).response?.data?.detail ??
        'Could not cancel the job.';
      setCancelMsg(detail);
    } finally {
      setCancelling(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Shifts you&apos;ve posted</p>
        <Button onClick={() => navigate('/post-job')} className="bg-emerald-600 text-white hover:bg-emerald-700">
          <Plus className="mr-1 size-4" /> Post a job
        </Button>
      </div>
      {cancelMsg && (
        <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-2 text-sm text-amber-700">
          {cancelMsg}
        </div>
      )}

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Briefcase className="size-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No jobs posted yet</p>
            <p className="text-sm text-slate-400">Post a shift to start receiving candidates.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const filledPct = (job.filled_count / job.positions_needed) * 100;
            return (
              <Card key={job.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">{job.role_title}</h3>
                        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', STATUS_STYLES[job.status] ?? 'bg-slate-100 text-slate-600')}>
                          {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(job.start_datetime).toLocaleString('en-NZ', {
                          weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
                        })}{' '}
                        · {job.duration_hours} hrs · ${job.pay_rate}/hr
                      </p>
                      <div className="mt-3 w-64">
                        <div className="mb-1 flex justify-between text-xs text-slate-500">
                          <span>{job.filled_count} of {job.positions_needed} filled</span>
                          <span>{job.positions_remaining} remaining</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${filledPct}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-end gap-2">
                      {job.status === 'CANCELLED' || job.status === 'CLOSED' ? (
                        <Button variant="outline" disabled className="cursor-not-allowed opacity-50">
                          <Users className="mr-1 size-4" /> View shortlist
                        </Button>
                      ) : (
                        <Button onClick={() => navigate(`/jobs/${job.id}/shortlist`)} variant="outline">
                          <Users className="mr-1 size-4" /> View shortlist
                        </Button>
                      )}
                      {(job.status === 'OPEN' || job.status === 'FILLED') && (
                        <Button
                          variant="ghost"
                          onClick={() => setConfirmId(job.id)}
                          disabled={cancelling === job.id}
                          className="h-auto px-2 py-1 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          {cancelling === job.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <><X className="mr-1 size-3" /> Cancel job</>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <ConfirmDialog
        open={confirmId !== null}
        title="Cancel this job?"
        message="Any placed workers will be released and notified, and they'll be free to apply for other shifts. This can't be undone."
        confirmLabel="Cancel job"
        destructive
        onConfirm={() => confirmId !== null && doCancel(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
