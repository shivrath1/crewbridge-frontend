import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, LogOut, Zap, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, ROLE_LABELS, type Role } from '@/lib/navConfig';
import { useAuth } from '@/context/AuthContext';

export function Sidebar({ unreadCount }: { unreadCount: number }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const role = user.role as Role;
  const items = NAV_ITEMS[role] ?? [];
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email;
  const initials =
    (user.first_name?.[0] ?? user.email[0]).toUpperCase() +
    (user.last_name?.[0] ?? '').toUpperCase();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-[#0f172a]">
      <div className="border-b border-white/[0.06] px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500">
            <Zap className="size-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Crewbridge
          </span>
        </div>
      </div>

      <div className="border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-400">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {displayName}
            </p>
            <p className="text-xs text-slate-400">{ROLE_LABELS[role]}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          if (item.soon) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-colors hover:text-slate-400"
              >
                <Lock className="size-4 flex-shrink-0 text-slate-600" />
                <span className="flex-1 text-left text-sm">{item.label}</span>
                <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  Soon
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                active
                  ? 'bg-emerald-500/[0.12] text-emerald-400'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
              )}
            >
              <Icon className="size-4 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-white/[0.06] px-2 py-3">
        <button
          onClick={() => navigate('/notifications')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <Bell className="size-4" />
          <span className="flex-1 text-left text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <LogOut className="size-4" />
          <span className="text-sm">Sign out</span>
        </button>
      </div>
    </aside>
  );
}