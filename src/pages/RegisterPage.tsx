import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Loader2,
  Zap,
  Briefcase,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// Backend role values; WORKER is shown as "Job Seeker".
const ROLES = [
  {
    value: 'WORKER',
    label: 'Job Seeker',
    desc: 'Find hospitality shifts',
    icon: Briefcase,
  },
  {
    value: 'EMPLOYER',
    label: 'Employer',
    desc: 'Hire trained staff',
    icon: Building2,
  },
  {
    value: 'TRAINER',
    label: 'Trainer',
    desc: 'Train & certify workers',
    icon: GraduationCap,
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!role) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({
        email,
        password,
        role,
        first_name: firstName,
        last_name: lastName,
      });
      navigate('/dashboard');
    } catch {
      setError('Could not create account. The email may already be in use.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500">
              <Zap className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0f172a]">Crewbridge</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Join New Zealand&apos;s hospitality workforce platform
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                I am a…
              </label>
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const active = role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center transition-all',
                        active
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      )}
                    >
                      <Icon className="size-5" />
                      <div>
                        <p className="text-sm font-medium">{r.label}</p>
                        <p className="text-xs text-slate-400">{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  First name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Last name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password{' '}
                <span className="font-normal text-slate-400">
                  (min 8 characters)
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(inputCls, 'pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPass ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputCls}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-0.5 rounded"
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              disabled={!role || !terms || loading}
              className="w-full bg-emerald-600 py-2.5 text-white hover:bg-emerald-700"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Card>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-emerald-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
