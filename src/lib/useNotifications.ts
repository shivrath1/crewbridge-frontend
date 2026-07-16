import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

const POLL_MS = 10000;

export function useNotifications() {
  const [items, setItems] = useState<Notification[]>([]);

  const refresh = useCallback(async () => {
    const data = await api
      .get('/notifications/')
      .then((r) => r.data)
      .catch(() => null);
    if (data) setItems(data);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    const id = setInterval(() => void refresh(), POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  const unreadCount = items.filter((n) => !n.is_read).length;

  const markRead = useCallback(async (id: number) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await api.patch(`/notifications/${id}/read/`).catch(() => {});
  }, []);

  const markAllRead = useCallback(async () => {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await api.post('/notifications/read-all/').catch(() => {});
  }, []);

  return { items, unreadCount, refresh, markRead, markAllRead };
}
