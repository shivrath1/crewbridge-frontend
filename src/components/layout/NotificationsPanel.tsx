import { X, CheckCheck, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/useNotifications';

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
  });
}

interface Props {
  open: boolean;
  items: Notification[];
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
}

export function NotificationsPanel({
  open,
  items,
  onClose,
  onMarkRead,
  onMarkAllRead,
}: Props) {
  const navigate = useNavigate();
  if (!open) return null;

  function handleClick(n: Notification) {
    if (!n.is_read) onMarkRead(n.id);
    if (n.link) {
      navigate(n.link);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/30" />
      <div
        className="relative flex h-full w-96 flex-col border-l border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="font-semibold text-slate-800">Notifications</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            >
              <CheckCheck className="size-3.5" /> Mark all read
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <Bell className="size-8 text-slate-300" />
              <p className="text-sm text-slate-400">No notifications yet</p>
            </div>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn(
                  'flex w-full items-start gap-3 border-b border-slate-50 px-5 py-4 text-left transition-colors hover:bg-slate-50',
                  !n.is_read && 'bg-emerald-50/40'
                )}
              >
                <div
                  className={cn(
                    'mt-1.5 size-2 flex-shrink-0 rounded-full',
                    n.is_read ? 'bg-transparent' : 'bg-emerald-500'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {timeAgo(n.created_at)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
