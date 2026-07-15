import { useNavigate } from 'react-router-dom';
import { Zap, Bot, Shield, Users, GraduationCap, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    icon: Bot,
    title: 'AI Screening',
    desc: 'Every job seeker takes a timed adaptive interview based on their CV. Questions are generated automatically — no interviewer required.',
    iconBg: 'bg-emerald-50 text-emerald-600',
    live: true,
  },
  {
    icon: Shield,
    title: 'Compliance Built In',
    desc: 'Right-to-work verification, weekly-hour limits, and shift-clash detection run before any candidate appears on your shortlist.',
    iconBg: 'bg-blue-50 text-blue-600',
    live: true,
  },
  {
    icon: Users,
    title: 'Ranked Shortlists',
    desc: "Employers see candidates ranked for their specific shift, with the AI's reason for each ranking. You decide who gets the job.",
    iconBg: 'bg-violet-50 text-violet-600',
    live: true,
  },
  {
    icon: GraduationCap,
    title: 'Training Network',
    desc: 'Browse courses and earn certificates through our network of accredited trainers.',
    iconBg: 'bg-amber-50 text-amber-600',
    live: false,
  },
  {
    icon: Star,
    title: 'Reputation System',
    desc: 'Build a verified professional reputation through reviews from venues and colleagues.',
    iconBg: 'bg-orange-50 text-orange-600',
    live: false,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-8 lg:px-12">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500">
              <Zap className="size-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#0f172a]">Crewbridge</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign in
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Get started
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111c34] to-[#0b1220] text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              <Bot className="size-3.5" /> AI-powered workforce platform
            </div>
            <h1 className="mb-5 text-5xl font-extrabold leading-tight">
              Find Work-Ready Staff Faster
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-slate-300">
              Built for New Zealand hospitality. Every candidate you see has been
              AI-screened, verified as legally able to work, and checked for scheduling
              conflicts before you ever look at their name.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                For Employers <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                For Job Seekers <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-400">Candidate shortlist · Bartender shift</p>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
                AI ranked
              </span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'A. Ngata', fit: '94%', score: '8.6', reason: '5 yrs bar experience, no conflicts' },
                { name: 'T. Wirihana', fit: '87%', score: '7.9', reason: 'Solid FOH background, available' },
                { name: 'S. Pereira', fit: '79%', score: '7.4', reason: 'Good CV, slightly less bar exp' },
              ].map((c, i) => (
                <div
                  key={c.name}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <span className="w-5 text-lg font-bold text-slate-500">#{i + 1}</span>
                  <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-300">
                    {c.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{c.name}</p>
                    <p className="truncate text-xs text-slate-400">{c.reason}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-emerald-400">{c.fit}</p>
                    <p className="text-xs text-slate-500">{c.score}/10</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-slate-500">
              AI recommends — you make the final decision
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-3 text-center text-3xl font-bold text-[#0f172a]">
          How Crewbridge works
        </h2>
        <p className="mx-auto mb-14 max-w-xl text-center text-slate-500">
          Matching verified, screened candidates with shifts that suit them. No guesswork,
          no unvetted CVs.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`rounded-xl border border-slate-100 p-6 ${!f.live ? 'bg-slate-50 opacity-60' : ''}`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className={`flex size-10 items-center justify-center rounded-lg ${f.iconBg}`}>
                    <Icon className="size-5" />
                  </div>
                  {!f.live && (
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="mb-2 font-semibold text-[#0f172a]">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-slate-50 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-emerald-500">
              <Zap className="size-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Crewbridge</span>
          </div>
          <p className="text-xs text-slate-400">New Zealand hospitality workforce platform</p>
        </div>
      </footer>
    </div>
  );
}
