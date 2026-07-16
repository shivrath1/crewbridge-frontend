import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic2,
  MessageSquare,
  Timer,
  Bot,
  Clock,
  Shield,
  ArrowRight,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatTime } from '@/lib/utils';
import api from '@/lib/api';
import { useInterviewTimer } from './interview/useInterviewTimer';

type Screen =
  'loading' | 'instructions' | 'question' | 'scoring' | 'result' | 'failed';

interface Question {
  id: number;
  order: number;
  text: string;
  instructions: string;
  read_seconds: number;
  answer_seconds: number;
  served_at: string;
  answered_count: number;
  questions_to_complete: number;
}

interface Session {
  status: string;
  interview_score: number | null;
  overall_score: number | null;
  scoring_reasoning: string;
  scoring_strengths: string[];
  scoring_concerns: string[];
  retry_allowed_after: string | null;
  answered_count: number;
}

export default function ScreeningInterview() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('loading');
  const [question, setQuestion] = useState<Question | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [answer, setAnswer] = useState('');
  const [starting, setStarting] = useState(false);
  const submittingRef = useRef(false);

  const timer = useInterviewTimer(
    question?.served_at ?? null,
    question?.read_seconds ?? 30,
    question?.answer_seconds ?? 90
  );

  // ---- Load current state on mount ------------------------------------------
  useEffect(() => {
    async function load() {
      const data = await api
        .get('/interview/')
        .then((r) => r.data)
        .catch(() => null);
      if (!data) {
        setScreen('instructions');
        return;
      }
      setSession(data);
      if (data.status === 'COMPLETED') setScreen('result');
      else if (data.status === 'FAILED') setScreen('failed');
      else if (data.status === 'PENDING_SCORING') {
        setScreen('scoring');
        void scoreInterview();
      } else if (data.status === 'IN_PROGRESS') {
        await loadQuestion();
      } else setScreen('instructions');
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Fetch the current question -------------------------------------------
  const loadQuestion = useCallback(async () => {
    const res = await api
      .get('/interview/question/')
      .catch((e) => e.response ?? null);
    if (res?.status === 200) {
      setQuestion(res.data);
      setAnswer('');
      setScreen('question');
    } else {
      // Pool exhausted or no question — re-check the session status.
      const s = await api
        .get('/interview/')
        .then((r) => r.data)
        .catch(() => null);
      if (s?.status === 'FAILED') {
        setSession(s);
        setScreen('failed');
      } else if (s?.status === 'PENDING_SCORING') {
        setScreen('scoring');
        void scoreInterview();
      }
    }
  }, []);

  // ---- Submit the current answer --------------------------------------------
  const submitAnswer = useCallback(
    async (autoSubmitted: boolean) => {
      if (!question || submittingRef.current) return;
      submittingRef.current = true;
      try {
        const res = await api.post('/interview/submit/', {
          question_id: question.id,
          text: answer,
          auto_submitted: autoSubmitted,
        });
        const s: Session = res.data;
        setSession(s);
        if (s.status === 'PENDING_SCORING') {
          setScreen('scoring');
          await scoreInterview();
        } else if (s.status === 'FAILED') {
          setScreen('failed');
        } else {
          await loadQuestion();
        }
      } finally {
        submittingRef.current = false;
      }
    },
    [question, answer, loadQuestion]
  );

  // ---- Auto-submit when the answer window expires ---------------------------
  useEffect(() => {
    if (screen === 'question' && timer.phase === 'expired') {
      void submitAnswer(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, timer.phase]);

  // ---- Score the interview --------------------------------------------------
  async function scoreInterview() {
    const res = await api.post('/interview/score/').catch((e) => e.response ?? null);
    if (res?.status === 200) {
      const s = res.data;
      setSession(s);
      // Respect the actual outcome — a below-threshold score comes back FAILED.
      if (s.status === 'FAILED') {
        setScreen('failed');
      } else {
        setScreen('result');
      }
    }
    // 202 = scoring not ready; the "scoring" screen stays up and retries.
  }

  // Retry scoring while it's pending (e.g. transient AI unavailability).
  useEffect(() => {
    if (screen !== 'scoring') return;
    const id = setInterval(() => {
      void scoreInterview();
    }, 15000);
    return () => clearInterval(id);
  }, [screen]);

  async function startInterview() {
    setStarting(true);
    try {
      await api.post('/interview/');
      await loadQuestion();
    } catch {
      // If they can't start (e.g. no CV / not eligible), send them to fix it.
      navigate('/dashboard');
    } finally {
      setStarting(false);
    }
  }

  // ============================ RENDER =======================================

  if (screen === 'loading') {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="mr-2 size-5 animate-spin" /> Loading…
      </div>
    );
  }

  if (screen === 'instructions') {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#0f172a]">
            <Mic2 className="size-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Screening Interview
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Read the instructions carefully before you start
          </p>
        </div>
        <Card className="mb-6 w-full">
          <CardContent className="p-8">
            <h2 className="mb-5 font-semibold text-slate-800">
              How this works
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: MessageSquare,
                  text: '5 questions, one at a time. You cannot go back.',
                },
                {
                  icon: Timer,
                  text: 'You get 30 seconds to read each question, then 90 seconds to type your answer.',
                },
                {
                  icon: Bot,
                  text: 'Questions are generated from your CV — they are specific to your background.',
                },
                {
                  icon: Clock,
                  text: 'The timer runs continuously. If time runs out, your answer is submitted automatically.',
                },
                {
                  icon: Shield,
                  text: 'Your answers are saved immediately. A lost connection won\u2019t lose your work.',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className="size-3.5 text-slate-500" />
                    </div>
                    <p className="text-sm text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-700">
                <strong>Once you start, there is no pausing.</strong> Make sure
                you have 15\u201320 minutes and a stable internet connection
                before beginning.
              </p>
            </div>
          </CardContent>
        </Card>
        <Button
          onClick={startInterview}
          disabled={starting}
          className="w-full bg-emerald-600 py-3 text-base text-white hover:bg-emerald-700"
        >
          {starting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Start Interview <ArrowRight className="size-4" />
            </>
          )}
        </Button>
        <p className="mt-3 text-center text-xs text-slate-400">
          You can only take this interview once every 30 days
        </p>
      </div>
    );
  }

  if (screen === 'scoring') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
            <Loader2 className="size-7 animate-spin text-emerald-500" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-slate-800">
            Your answers are in
          </h1>
          <p className="text-slate-600">
            We&apos;re scoring your interview now. This usually takes under a
            minute.
          </p>
          <p className="mt-3 text-sm text-slate-400">
            Your answers are saved — it&apos;s safe to wait here.
          </p>
        </div>
      </div>
    );
  }

  if (screen === 'failed') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-slate-100">
            <Clock className="size-7 text-slate-400" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-slate-800">
            Interview didn&apos;t pass this time
          </h1>

          <p className="leading-relaxed text-slate-600">
            This attempt didn&apos;t meet the threshold to enter the candidate
            pool. That&apos;s okay — you can prepare and try again. Your
            progress has been saved.
          </p>
          <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">You can retry from</span>
              <span className="font-semibold text-slate-800">
                {session?.retry_allowed_after
                  ? new Date(session.retry_allowed_after).toLocaleDateString(
                      'en-NZ'
                    )
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Questions answered</span>
              <span className="font-semibold text-slate-800">
                {session?.answered_count ?? 0} of 5
              </span>
            </div>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            In the meantime, building your skills through training can help you
            do better next time.
          </p>
        </div>
      </div>
    );
  }

  if (screen === 'result' && session) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500">
            <CheckCircle2 className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Interview complete
            </h1>
            <p className="text-sm text-slate-500">
              AI has scored your interview — a human reviews any flags
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <Bot className="size-4 text-emerald-500" />
              <h2 className="font-semibold text-slate-800">
                Your screening result
              </h2>
            </div>
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-4xl font-extrabold text-emerald-700">
                  {session.overall_score ?? '—'}
                </p>
                <p className="mt-1 text-center text-xs font-medium text-emerald-600">
                  Overall / 10
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-slate-800">
                    {session.interview_score ?? '—'}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Interview score
                  </p>
                </div>
                <div className="flex items-center justify-center rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
                  In the pool
                </div>
              </div>
            </div>

            {(session.scoring_strengths?.length > 0 ||
              session.scoring_concerns?.length > 0) && (
              <div className="mb-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />{' '}
                    Strengths
                  </p>
                  <ul className="space-y-1.5">
                    {(session.scoring_strengths ?? []).map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-1.5 text-sm text-slate-700"
                      >
                        <span className="mt-0.5 text-emerald-500">•</span> {s}
                      </li>
                    ))}
                    {session.scoring_strengths?.length === 0 && (
                      <li className="text-sm text-slate-400">—</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <AlertCircle className="size-3.5 text-amber-500" /> Areas to
                    develop
                  </p>
                  <ul className="space-y-1.5">
                    {(session.scoring_concerns ?? []).map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-1.5 text-sm text-slate-700"
                      >
                        <span className="mt-0.5 text-amber-500">•</span> {s}
                      </li>
                    ))}
                    {session.scoring_concerns?.length === 0 && (
                      <li className="text-sm text-slate-400">—</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {session.scoring_reasoning && (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <p className="mb-1.5 text-xs font-medium text-slate-500">
                  AI reasoning
                </p>
                <p className="text-sm leading-relaxed text-slate-700">
                  {session.scoring_reasoning}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <CheckCircle2 className="size-5 flex-shrink-0 text-emerald-500" />
          <div>
            <p className="font-semibold text-emerald-800">
              You&apos;re now in the candidate pool
            </p>
            <p className="mt-0.5 text-sm text-emerald-700">
              Employers can shortlist you for shifts that match your background.
            </p>
          </div>
        </div>

        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  // ---- Question screen (reading / answering) --------------------------------
  if (screen === 'question' && question) {
    const isReading = timer.phase === 'reading';
    const answered = question.answered_count;
    const total = question.questions_to_complete;

    const ringColor = !isReading
      ? timer.remaining <= 10
        ? 'border-red-400 bg-red-50'
        : timer.remaining <= 30
          ? 'border-amber-400 bg-amber-50'
          : 'border-emerald-400 bg-emerald-50'
      : 'border-slate-300 bg-slate-50';

    const timeColor = !isReading
      ? timer.remaining <= 10
        ? 'text-red-500'
        : timer.remaining <= 30
          ? 'text-amber-500'
          : 'text-slate-800'
      : 'text-slate-800';

    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">
              Question {answered + 1} of {total}
            </p>
            <p className="text-xs text-slate-400">
              {isReading ? 'Reading time' : 'Answering time'}
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(answered / total) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-7">
            <div className="flex items-start gap-6">
              <div
                className={cn(
                  'flex size-20 flex-shrink-0 flex-col items-center justify-center rounded-full border-4 transition-colors',
                  ringColor
                )}
              >
                <p
                  className={cn(
                    'font-mono text-xl font-bold tabular-nums',
                    timeColor
                  )}
                >
                  {formatTime(timer.remaining)}
                </p>
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-400">
                  {isReading ? 'read' : 'answer'}
                </p>
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-lg font-semibold leading-snug text-slate-800">
                  {question.text}
                </h2>
                <p className="text-sm italic text-slate-500">
                  {question.instructions}
                </p>
                {isReading && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400">
                    <Lock className="size-3.5" />
                    Reading time — answer box unlocks in{' '}
                    {formatTime(timer.remaining)}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Your answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isReading}
              placeholder={
                isReading
                  ? 'Locked during reading time…'
                  : 'Type your answer here…'
              }
              rows={6}
              className={cn(
                'w-full resize-none rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30',
                isReading
                  ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                  : 'border-slate-200 bg-white text-slate-800'
              )}
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                {answer.length} characters
              </p>
              <Button
                onClick={() => submitAnswer(false)}
                disabled={isReading}
                className="bg-emerald-600 px-6 text-white hover:bg-emerald-700"
              >
                Submit answer
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400">
          No back button · No skip · Your answer auto-submits when time runs out
        </p>
      </div>
    );
  }

  return null;
}
