import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Bot,
  Award,
  Star,
  DollarSign,
  Briefcase,
  ChevronRight,
  CheckCheck,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

type StepStatus = 'done' | 'active' | 'pending';

interface Job {
  id: number;
  role_title: string;
  venue_name: string;
  start_datetime: string;
  duration_hours: number;
  pay_rate: string;
}

interface DashboardData {
  cvUploaded: boolean;
  cvScore: number | null;
  eligible: boolean;
  interviewStatus: string | null;
  interviewScore: number | null;
  overallScore: number | null;
  reasoning: string;
  jobs: Job[];
}

function OnboardingStep({
  step,
  status,
  title,
  subtitle,
  ctaLabel,
  onCTA,
  last,
}: {
  step: number;
  status: StepStatus;
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCTA: () => void;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex size-9 flex-shrink-0 items-center justify-center rounded-full border-2',
            status === 'done'
              ? 'border-emerald-200 bg-emerald-50'
              : status === 'active'
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-slate-200 bg-slate-50'
          )}
        >
          {status === 'done' ? (
            <CheckCircle2 className="size-5 text-emerald-500" />
          ) : status === 'active' ? (
            <div className="size-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          ) : (
            <Circle className="size-5 text-slate-300" />
          )}
        </div>
        {!last && (
          <div
            className={cn(
              'mt-1 h-10 w-0.5',
              status === 'done' ? 'bg-emerald-200' : 'bg-slate-200'
            )}
          />
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p
              className={cn(
                'font-semibold',
                status === 'active'
                  ? 'text-slate-900'
                  : status === 'done'
                    ? 'text-slate-600'
                    : 'text-slate-400'
              )}
            >
              {step}. {title}
            </p>
            <p
              className={cn(
                'mt-0.5 text-sm',
                status === 'active' ? 'text-slate-600' : 'text-slate-400'
              )}
            >
              {subtitle}
            </p>
          </div>
          {status === 'active' && (
            <Button
              onClick={onCTA}
              className="ml-4 flex-shrink-0 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobseekerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      // A 404 is a valid state ("not done yet"), not an error — so we catch
      // each call at the source and return null rather than throwing.
      const get = (url: string) =>
        api
          .get(url)
          .then((r) => r.data)
          .catch(() => null);

      const [cv, profile, interview, jobs] = await Promise.all([
        get('/cv/'),
        get('/profile/me/'),
        get('/interview/'),
        get('/jobs/'),
      ]);

      if (!profile) {
        setError(true);
        setLoading(false);
        return;
      }

      setData({
        cvUploaded: cv !== null,
        cvScore: profile.cv_score,
        eligible: profile.eligibility_status === 'ELIGIBLE',
        interviewStatus: interview?.status ?? null,
        interviewScore: interview?.interview_score ?? null,
        overallScore: interview?.overall_score ?? null,
        reasoning: interview?.scoring_reasoning ?? '',
        jobs: jobs ?? [],
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="mr-2 size-5 animate-spin" /> Loading your dashboard…
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-slate-500">
          Couldn&apos;t load your dashboard. Please refresh and try again.
        </CardContent>
      </Card>
    );
  }

  const interviewSubmitted =
    data.interviewStatus === 'COMPLETED' ||
    data.interviewStatus === 'PENDING_SCORING';

  const allDone = data.cvUploaded && data.eligible && interviewSubmitted;
  const firstName = user?.first_name || user?.email?.split('@')[0] || '';

  const cvStatus: StepStatus = data.cvUploaded ? 'done' : 'active';
  const docsStatus: StepStatus = data.eligible
    ? 'done'
    : data.cvUploaded
      ? 'active'
      : 'pending';
  const interviewStatus: StepStatus = interviewSubmitted
    ? 'done'
    : data.eligible
      ? 'active'
      : 'pending';

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-xl bg-[#0f172a] px-7 py-6 text-white">
        <p className="mb-1 text-sm text-slate-400">Welcome back</p>
        <h1 className="text-2xl font-bold">Kia ora, {firstName} 👋</h1>
        <p
          className={cn(
            'mt-2 text-sm',
            allDone ? 'text-emerald-400' : 'text-slate-300'
          )}
        >
          {allDone
            ? "You're in the candidate pool — employers can now shortlist you for shifts."
            : 'Complete the steps below to get into the candidate pool.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800">
                  Getting started
                </h2>
                {allDone ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    <CheckCheck className="size-3" /> All done
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    <AlertTriangle className="size-3" /> Not shortlistable yet
                  </div>
                )}
              </div>

              <OnboardingStep
                step={1}
                status={cvStatus}
                title="Upload your CV"
                subtitle={
                  data.cvUploaded
                    ? 'CV uploaded and analysed by AI'
                    : 'Upload your CV so we can tailor your screening interview'
                }
                ctaLabel="Upload CV"
                onCTA={() => navigate('/my-cv')}
              />
              <OnboardingStep
                step={2}
                status={docsStatus}
                title="Verify your documents"
                subtitle={
                  data.eligible
                    ? 'Eligible to work in NZ'
                    : 'Upload your visa, ID or work permit'
                }
                ctaLabel="Verify documents"
                onCTA={() => navigate('/documents')}
              />
              <OnboardingStep
                step={3}
                status={interviewStatus}
                title="Complete your screening interview"
                subtitle={
                  data.interviewStatus === 'COMPLETED'
                    ? 'Interview complete — scored by AI'
                    : data.interviewStatus === 'PENDING_SCORING'
                      ? 'Interview submitted — scoring in progress'
                      : '5 questions, about 10 minutes, timed'
                }
                ctaLabel="Start interview"
                onCTA={() => navigate('/interview')}
                last
              />

              {!allDone && (
                <p className="mt-1 border-t border-slate-100 pt-2 text-xs text-slate-400">
                  You won&apos;t appear on any employer&apos;s shortlist until
                  all three steps are complete.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {allDone && data.overallScore !== null ? (
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Bot className="size-4 text-emerald-500" />
                  <p className="text-sm font-semibold text-slate-700">
                    AI Screening Score
                  </p>
                </div>
                <div className="mb-4 text-center">
                  <p className="text-5xl font-extrabold text-slate-900">
                    {data.overallScore}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Overall rating / 10
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">CV score</span>
                    <span className="font-semibold text-slate-800">
                      {data.cvScore ?? '—'} / 10
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Interview score</span>
                    <span className="font-semibold text-slate-800">
                      {data.interviewScore ?? '—'} / 10
                    </span>
                  </div>
                </div>
                {data.reasoning && (
                  <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-400">
                    {data.reasoning}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-5 text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100">
                  <Award className="size-6 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-600">
                  Your rating
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Complete all three steps to unlock your score
                </p>
              </CardContent>
            </Card>
          )}

          {[
            { icon: Star, label: 'Reputation' },
            { icon: DollarSign, label: 'Earnings' },
          ].map((cs) => {
            const Icon = cs.icon;
            return (
              <Card
                key={cs.label}
                className="relative overflow-hidden opacity-60"
              >
                <CardContent className="p-4">
                  <span className="absolute right-2 top-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                    Soon
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className="size-4 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        {cs.label}
                      </p>
                      <p className="text-xs text-slate-300">Coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Open jobs</h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/jobs')}
              className="text-emerald-600"
            >
              Browse all <ChevronRight className="size-4" />
            </Button>
          </div>

          {data.jobs.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No open jobs right now. Check back soon.
            </p>
          ) : (
            <div className="space-y-3">
              {data.jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 transition-colors hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100">
                      <Briefcase className="size-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {job.role_title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {job.venue_name} ·{' '}
                        {new Date(job.start_datetime).toLocaleString('en-NZ', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">
                        ${job.pay_rate}/hr
                      </p>
                      <p className="text-xs text-slate-400">
                        {job.duration_hours} hrs
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/jobs')}
                      className="px-3 py-1.5 text-xs"
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
