import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, MapPin, Plus, Loader2, Star, CreditCard, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, jobRef } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Job {
  id: number;
  role_title: string;
  start_datetime: string;
  pay_rate: string;
  positions_needed: number;
  filled_count: number;
  positions_remaining: number;
  status: string;
  applicant_count: number;
}

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [placementCount, setPlacementCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const get = (url: string) => api.get(url).then((r) => r.data).catch(() => []);
      const [jobsData, placements] = await Promise.all([get('/jobs/'), get('/placements/')]);
      setJobs(jobsData ?? []);
      setPlacementCount((placements ?? []).length);
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

  const openJobs = jobs.filter((j) => j.status === 'OPEN').length;
  const positionsToFill = jobs
    .filter((j) => j.status === 'OPEN')
    .reduce((sum, j) => sum + j.positions_remaining, 0);
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicant_count ?? 0), 0);

  const stats = [
    { label: 'Open jobs', value: openJobs, icon: Briefcase, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Positions to fill', value: positionsToFill, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total applicants', value: totalApplicants, icon: ClipboardList, color: 'text-amber-600 bg-amber-50' },
    { label: 'Confirmed placements', value: placementCount, icon: MapPin, color: 'text-violet-600 bg-violet-50' },
  ];

  const firstName = user?.first_name || user?.email?.split('@')[0] || '';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-xl bg-[#0f172a] px-7 py-6 text-white">
        <p className="mb-1 text-sm text-slate-400">Welcome back</p>
        <h1 className="text-2xl font-bold">Kia ora, {firstName} 👋</h1>
        <p className="mt-2 text-sm text-slate-300">
          Post shifts and review AI-screened candidates for your venue.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-6">
                <div className={`mb-4 flex size-10 items-center justify-center rounded-lg ${s.color}`}>
                  <Icon className="size-5" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Your jobs</h2>
            <Button onClick={() => navigate('/post-job')} className="bg-emerald-600 text-white hover:bg-emerald-700">
              <Plus className="mr-1 size-4" /> Post a job
            </Button>
          </div>

          {jobs.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No jobs yet. Post your first shift to start receiving candidates.
            </p>
          ) : (
            <div className="space-y-2">
              {jobs.slice(0, 5).map((job) => (
                <button
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}/shortlist`)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-100 px-4 py-3 text-left transition-colors hover:border-slate-200 hover:bg-slate-50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800">
                        {job.role_title}
                        <span className="ml-2 text-xs font-normal text-slate-400">{jobRef(job.id)}</span>
                      </p>
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700'
                          : job.status === 'FILLED' ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-600',
                      )}>
                        {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {new Date(job.start_datetime).toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className="text-sm text-slate-500">{job.filled_count}/{job.positions_needed} filled</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { icon: Star, label: 'Reputation' },
          { icon: CreditCard, label: 'Billing' },
        ].map((cs) => {
          const Icon = cs.icon;
          return (
            <Card key={cs.label} className="relative overflow-hidden opacity-60">
              <CardContent className="p-4">
                <span className="absolute right-2 top-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">Soon</span>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100">
                    <Icon className="size-4 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-400">{cs.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
