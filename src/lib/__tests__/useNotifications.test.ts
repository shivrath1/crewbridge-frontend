import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import { useNotifications } from '@/lib/useNotifications';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), patch: vi.fn(), post: vi.fn() },
}));
const mockGet = api.get as unknown as Mock;
const mockPatch = api.patch as unknown as Mock;
const mockPost = api.post as unknown as Mock;

const DATA = [
  {
    id: 1,
    title: 'A',
    message: 'm',
    link: '/interview',
    is_read: false,
    created_at: '2026-07-15T00:00:00Z',
  },
  {
    id: 2,
    title: 'B',
    message: 'm',
    link: '',
    is_read: true,
    created_at: '2026-07-15T00:00:00Z',
  },
];

describe('useNotifications', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPatch.mockReset();
    mockPost.mockReset();
    mockPatch.mockResolvedValue({});
    mockPost.mockResolvedValue({});
  });

  it('fetches notifications and computes the unread count', async () => {
    mockGet.mockResolvedValue({ data: DATA });
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(result.current.unreadCount).toBe(1);
  });

  it('marks one as read optimistically', async () => {
    mockGet.mockResolvedValue({ data: DATA });
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.items).toHaveLength(2));

    await act(async () => {
      await result.current.markRead(1);
    });

    expect(result.current.unreadCount).toBe(0);
    expect(mockPatch).toHaveBeenCalledWith('/notifications/1/read/');
  });

  it('marks all as read', async () => {
    mockGet.mockResolvedValue({ data: DATA });
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.items).toHaveLength(2));

    await act(async () => {
      await result.current.markAllRead();
    });

    expect(result.current.unreadCount).toBe(0);
    expect(mockPost).toHaveBeenCalledWith('/notifications/read-all/');
  });
});
