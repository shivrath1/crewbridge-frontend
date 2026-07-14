import { useLocation, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { PAGE_TITLES } from '@/lib/navConfig';
import { useAuth } from '@/context/AuthContext';

export function TopBar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pathBase = '/' + location.pathname.split('/')[1];
  const title = location.pathname.includes('/shortlist')
    ? 'Candidate Shortlist'
    : location.pathname.startsWith('/cs/')
      ? 'Coming soon'
      : (PAGE_TITLES[pathBase] ?? 'Crewbridge');

  const initials =
    (user?.first_name?.[0] ?? user?.email?.[0] ?? '?').toUpperCase() +
    (user?.last_name?.[0] ?? '').toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-white/90 px-6 backdrop-blur-sm">
      <h2 className="flex-1 text-base font-semibold text-slate-800">{title}</h2>
      <button
        onClick={() => navigate('/notifications')}
        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:bg-slate-50"
      >
        <Bell className="size-4 text-slate-600" />
      </button>
      <div className="flex size-8 items-center justify-center rounded-full bg-[#0f172a] text-xs font-semibold text-white">
        {initials}
      </div>
    </header>
  );
}
