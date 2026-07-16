import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/lib/useNotifications';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { NotificationsPanel } from './NotificationsPanel';

export function AppShell() {
  const { user, loading } = useAuth();
  const notifications = useNotifications();
  const [panelOpen, setPanelOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar unreadCount={notifications.unreadCount} />
      <div className="ml-64 flex min-h-0 flex-1 flex-col overflow-hidden">
        <TopBar
          unreadCount={notifications.unreadCount}
          onBellClick={() => setPanelOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <NotificationsPanel
        open={panelOpen}
        items={notifications.items}
        onClose={() => setPanelOpen(false)}
        onMarkRead={notifications.markRead}
        onMarkAllRead={notifications.markAllRead}
      />
    </div>
  );
}
