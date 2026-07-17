import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bot,
  Users,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { jobRef } from '@/lib/utils';

interface Candidate {
  application_id: number;
  worker_id: number;
  name: string;
  rank: number;
  fit_score: number;
  overall_rating: number;
  cv_score: number | null;
  interview_score: number | null;
  years_experience: number | null;
  roles: string[];
  reason: string;
  ai_ranked: boolean;
}

interface Shortlist {
  job_id: number;
  role_title: string;
  positions_needed: number;
  positions_remaining: number;
  candidate_count: number;
  candidates: Candidate[];
  note: string;
  accepted: { application_id: number; worker_id: number; name: string }[];
}

export default function CandidateShortlist() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Shortlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [accepting, setAccepting] = useState<number | null>(null);
  const [blocked, setBlocked] = useState<Record<number, string>>({});
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  async function viewProfile(workerId: number) {
    setProfileLoading(true);
    setProfile(null);
    const data = await api.get(`/candidates/${workerId}/`).then((r) => r.data).catch(() => null);
    setProfile(data);
    setProfileLoading(false);
  }

  const load = useCallback(async () => {
    const res = await api
      .get(`/jobs/${jobId}/shortlist/`)
      .then((r) => r.data)
      .catch(() => null);
    if (!res) setError(true);
    else setData(res);
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function accept(applicationId: number) {
    setAccepting(applicationId);
    setBlocked((b) => ({ ...b, [applicationId]: '' }));
    try {
      await api.post('/placements/accept/', { application_id: applicationId });
      // Re-fetch: the accepted candidate leaves the list, positions update,
      // and anyone who became non-placeable disappears.
      await load();
    } catch (e) {
      const detail =
        (e as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail ?? 'Could not accept this candidate.';
      setBlocked((b) => ({ ...b, [applicationId]: detail }));
    } finally {
      setAccepting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="mr-2 size-5 animate-spin" /> Loading shortlist…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="py-16 text-center text-slate-500">
            Couldn&apos;t load this shortlist.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <button
        onClick={() => navigate('/my-jobs')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="size-4" /> Back to my jobs
      </button>

      <div>
      <h1 className="text-2xl font-bold text-slate-800">
          {data.role_title}
          <span className="ml-2 text-base font-normal text-slate-400">{jobRef(data.job_id)}</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {data.positions_remaining} of {data.positions_needed} position
          {data.positions_needed !== 1 ? 's' : ''} remaining
        </p>
      </div>

      <div className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-3">
        <Bot className="size-5 flex-shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-medium text-emerald-800">
            AI recommends — you make the final decision
          </p>
          <p className="mt-0.5 text-xs text-emerald-700">
            Every candidate below has already passed right-to-work verification
            and shift-compliance checks.
          </p>
        </div>
      </div>

      {data.candidates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Users className="size-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">
              No candidates are currently placeable
            </p>
            <p className="max-w-md text-sm text-slate-400">
              Candidates appear here once they&apos;ve applied, completed
              screening, are verified as eligible to work, and have no
              scheduling conflict with this shift.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.candidates.map((c) => {
            const blockMsg = blocked[c.application_id];
            return (
              <Card key={c.application_id}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex w-8 flex-shrink-0 flex-col items-center">
                      <span className="text-lg font-bold text-slate-400">
                        #{c.rank}
                      </span>
                    </div>

                    <div className="flex size-11 flex-shrink-0 items-center justify-center rounded-full bg-[#0f172a] text-sm font-semibold text-white">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">
                          {c.name}
                        </h3>
                        {c.ai_ranked && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            <Bot className="size-2.5" /> AI ranked
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-sm text-slate-500">
                        {c.years_experience != null
                          ? `~${c.years_experience} yrs experience`
                          : 'Experience n/a'}
                      </p>

                      {c.roles?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {c.roles.slice(0, 4).map((r) => (
                            <span
                              key={r}
                              className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}

                      {c.reason && (
                        <div className="mt-3 flex gap-1.5 rounded-lg bg-slate-50 px-3 py-2">
                          <Bot className="mt-0.5 size-3.5 flex-shrink-0 text-slate-400" />
                          <p className="text-xs italic text-slate-600">
                            {c.reason}
                          </p>
                        </div>
                      )}

                      {blockMsg && (
                        <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
                          <AlertTriangle className="size-3.5" /> {blockMsg}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-shrink-0 flex-col items-end gap-3">
                      <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1">
                        <Award className="size-3.5 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">
                          {c.fit_score}
                        </span>
                        <span className="text-xs text-emerald-600">fit</span>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        <p>Overall {c.overall_rating}/10</p>
                        <p>
                          CV {c.cv_score ?? '—'} · Interview{' '}
                          {c.interview_score ?? '—'}
                        </p>
                      </div>
                      <Button
                        onClick={() => accept(c.application_id)}
                        disabled={
                          accepting === c.application_id ||
                          data.positions_remaining === 0
                        }
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        {accepting === c.application_id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          'Accept'
                        )}
                      </Button>
                      <button
                        onClick={() => viewProfile(c.worker_id)}
                        className="text-xs text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
                      >
                        View profile
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {data.accepted?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-700">Accepted for this shift</h2>
          {data.accepted.map((a) => (
            <Card key={a.application_id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                    {a.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-800">{a.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => viewProfile(a.worker_id)}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    View profile
                  </button>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="size-3.5" /> Accepted
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="size-3.5" />
        Candidates who are accepted elsewhere or would breach hour limits are
        removed automatically.
      </div>
      {(profile || profileLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setProfile(null)}>
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            {profileLoading ? (
              <div className="flex items-center justify-center py-12 text-slate-500">
                <Loader2 className="mr-2 size-5 animate-spin" /> Loading…
              </div>
            ) : profile ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">{profile.name as string}</h3>
                  <button onClick={() => setProfile(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-emerald-50 p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-700">{(profile.overall_score as number) ?? '—'}</p>
                    <p className="text-xs text-emerald-600">Overall</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="text-2xl font-bold text-slate-800">{(profile.cv_score as number) ?? '—'}</p>
                    <p className="text-xs text-slate-500">CV</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="text-2xl font-bold text-slate-800">{(profile.interview_score as number) ?? '—'}</p>
                    <p className="text-xs text-slate-500">Interview</p>
                  </div>
                </div>
                <p className="mb-1 text-xs text-slate-500">Domain · {(profile.detected_domain as string) || 'n/a'} · ~{(profile.years_experience as number) ?? 0} yrs</p>
                {Array.isArray(profile.roles) && (profile.roles as string[]).length > 0 && (
                  <div className="mb-3 mt-2 flex flex-wrap gap-1.5">
                    {(profile.roles as string[]).map((r) => (
                      <span key={r} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{r}</span>
                    ))}
                  </div>
                )}
                {Array.isArray(profile.skills) && (profile.skills as string[]).length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {(profile.skills as string[]).slice(0, 12).map((s) => (
                      <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{s}</span>
                    ))}
                  </div>
                )}
                {(profile.cv_reasoning as string) && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-600">{profile.cv_reasoning as string}</p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
