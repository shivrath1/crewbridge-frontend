import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-[#0f172a] p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500">
            <Zap className="size-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Crewbridge</span>
        </div>
        <div>
          <blockquote className="mb-4 text-xl font-medium leading-relaxed text-white">
            Every candidate you see has been AI-screened, verified as legally
            able to work, and checked for scheduling conflicts.
          </blockquote>
          <p className="text-sm text-slate-400">
            New Zealand hospitality workforce platform
          </p>
        </div>
        <p className="text-xs text-slate-600">Crewbridge</p>
      </div>

      <div className="flex flex-col items-center justify-center bg-white p-12">
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-2xl font-bold text-[#0f172a]">
            Welcome back
          </h1>
          <p className="mb-8 text-sm text-slate-500">
            Sign in to your Crewbridge account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-10 text-sm transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
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

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full py-2.5">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            No account?{' '}
            <Link
              to="/register"
              className="font-medium text-emerald-600 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
