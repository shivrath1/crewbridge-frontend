import { CheckCheck, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/lib/useNotifications';

export default function Notifications() {
  const navigate = useNavigate();
  const { items, markRead, markAllRead, unreadCount } = useNotifications();

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        </p>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
            <CheckCheck className="size-4" /> Mark all read
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Bell className="size-8 text-slate-300" />
            <p className="text-sm text-slate-400">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  if (!n.is_read) markRead(n.id);
                  if (n.link) navigate(n.link);
                }}
                className={cn(
                  'flex w-full items-start gap-3 border-b border-slate-50 px-5 py-4 text-left transition-colors last:border-0 hover:bg-slate-50',
                  !n.is_read && 'bg-emerald-50/40',
                )}
              >
                <div className={cn('mt-1.5 size-2 flex-shrink-0 rounded-full', n.is_read ? 'bg-transparent' : 'bg-emerald-500')} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">{n.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(n.created_at).toLocaleString('en-NZ', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
