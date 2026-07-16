import { useEffect, useState } from 'react';
import { Loader2, Ban, RotateCcw, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import api from '@/lib/api';

interface AdminUser {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

const ROLE_LABEL: Record<string, string> = {
  WORKER: 'Job Seeker', EMPLOYER: 'Employer', TRAINER: 'Trainer', ADMIN: 'Admin',
};

export default function Accounts() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [removeId, setRemoveId] = useState<number | null>(null);

  async function load() {
    const data = await api.get('/admin/users/').then((r) => r.data).catch(() => []);
    setUsers(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function toggleActive(u: AdminUser) {
    setBusy(u.id);
    try {
      await api.patch(`/admin/users/${u.id}/`, { is_active: !u.is_active });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_active: !x.is_active } : x)));
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: number) {
    setRemoveId(null);
    setBusy(id);
    try {
      await api.delete(`/admin/users/${id}/`);
      setUsers((prev) => prev.filter((x) => x.id !== id));
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="mr-2 size-5 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-800">All accounts</h2>
            <p className="text-sm text-slate-400">{users.length} users</p>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Email</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Role</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-50">
                  <td className="px-5 py-3 text-sm text-slate-800">
                    {[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{u.email}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{ROLE_LABEL[u.role] ?? u.role}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-medium',
                      u.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
                    )}>
                      {u.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(u)}
                        disabled={busy === u.id || u.role === 'ADMIN'}
                        className={cn(
                          'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition-colors disabled:opacity-40',
                          u.is_active
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-emerald-600 hover:bg-emerald-50',
                        )}
                      >
                        {u.is_active ? <><Ban className="size-3.5" /> Suspend</> : <><RotateCcw className="size-3.5" /> Reactivate</>}
                      </button>
                      <button
                        onClick={() => setRemoveId(u.id)}
                        disabled={busy === u.id || u.role === 'ADMIN'}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={removeId !== null}
        title="Remove this account?"
        message="This permanently deletes the user and their data. This can't be undone."
        confirmLabel="Remove"
        destructive
        onConfirm={() => removeId !== null && remove(removeId)}
        onCancel={() => setRemoveId(null)}
      />
    </div>
  );
}
