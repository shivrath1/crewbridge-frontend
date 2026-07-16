import { useEffect, useState } from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface Job {
  id: number;
  role_title: string;
  venue_name: string;
  start_datetime: string;
  duration_hours: number;
  pay_rate: string;
  positions_remaining: number;
  status: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-NZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function BrowseJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<number | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [blocked, setBlocked] = useState<Record<number, string>>({});
  const [ready, setReady] = useState(true);

  useEffect(() => {
    async function load() {
      const get = (url: string) =>
        api
          .get(url)
          .then((r) => r.data)
          .catch(() => null);

      const [jobsData, appsData, profile, interviewData] = await Promise.all([
        get('/jobs/'),
        get('/applications/'),
        get('/profile/me/'),
        get('/interview/'),
      ]);

      const cvOk = profile?.cv_score != null;
      const eligible = profile?.eligibility_status === 'ELIGIBLE';
      const interviewOk = interviewData?.status === 'COMPLETED';

      setReady(Boolean(cvOk && eligible && interviewOk));

      setJobs(jobsData ?? []);
      setAppliedIds((appsData ?? []).map((a: { job: number }) => a.job));
      setLoading(false);
    }

    load();
  }, []);

  async function apply(jobId: number) {
    setSubmitting(true);
    setBlocked((b) => ({ ...b, [jobId]: '' }));

    try {
      await api.post('/applications/', {
        job: jobId,
        cover_note: coverNote,
      });

      setAppliedIds((ids) => [...ids, jobId]);
      setApplyingTo(null);
      setCoverNote('');
    } catch (e) {
      const detail =
        (e as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail ?? 'Could not apply to this job.';

      setBlocked((b) => ({ ...b, [jobId]: detail }));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="mr-2 size-5 animate-spin" />
        Loading jobs…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <p className="text-sm text-slate-500">
        Open shifts looking for candidates like you
      </p>

      {!ready && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertTriangle className="size-4" />
          Complete your CV, document verification, and screening interview
          before you can apply.
        </div>
      )}

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-slate-400">
            No open jobs right now. Check back soon.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const isApplied = appliedIds.includes(job.id);
            const blockMsg = blocked[job.id];

            return (
              <Card key={job.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <Briefcase className="size-5 text-slate-500" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {job.role_title}
                        </h3>

                        <p className="mt-0.5 text-sm text-slate-500">
                          {job.venue_name}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {fmtDate(job.start_datetime)}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {job.duration_hours} hrs
                          </span>

                          <span className="flex items-center gap-1">
                            <DollarSign className="size-3.5" />${job.pay_rate}
                            /hr
                          </span>

                          {job.positions_remaining > 0 && (
                            <span className="font-medium text-emerald-600">
                              {job.positions_remaining} spot
                              {job.positions_remaining !== 1 ? 's' : ''}{' '}
                              remaining
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 flex-col items-end gap-2">
                      {isApplied ? (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          Applied
                        </span>
                      ) : applyingTo === job.id ? (
                        <div className="w-64 space-y-2">
                          <textarea
                            value={coverNote}
                            onChange={(e) => setCoverNote(e.target.value)}
                            placeholder="Optional cover note"
                            rows={3}
                            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          />

                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setApplyingTo(null)}
                              className="px-3 text-xs"
                            >
                              Cancel
                            </Button>

                            <Button
                              onClick={() => apply(job.id)}
                              disabled={submitting}
                              className="bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-700"
                            >
                              {submitting ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                'Submit'
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setApplyingTo(job.id)}
                          disabled={!ready}
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>

                  {blockMsg && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
                      <AlertTriangle className="size-3.5" />
                      {blockMsg}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
