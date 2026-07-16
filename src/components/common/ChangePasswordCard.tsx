import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export function ChangePasswordCard() {
  const [oldPassword, setOld] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  async function submit() {
    setMsg(null);
    if (newPassword !== confirm) {
      setMsg({ text: 'New passwords do not match.', ok: false });
      return;
    }
    setSaving(true);
    try {
      await api.post('/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setMsg({ text: 'Password updated.', ok: true });
      setOld('');
      setNew('');
      setConfirm('');
    } catch (e) {
      const detail =
        (e as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail ?? 'Could not update password.';
      setMsg({ text: detail, ok: false });
    } finally {
      setSaving(false);
    }
  }

  const input =
    'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30';

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 font-semibold text-slate-800">Change password</h2>
        <div className="grid max-w-md gap-3">
          <input
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOld(e.target.value)}
            className={input}
          />
          <input
            type="password"
            placeholder="New password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
            className={input}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={input}
          />
          {msg && (
            <p
              className={
                msg.ok ? 'text-sm text-emerald-600' : 'text-sm text-red-600'
              }
            >
              {msg.text}
            </p>
          )}
          <Button
            onClick={submit}
            disabled={saving || !oldPassword || !newPassword}
            className="w-fit bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Update password'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
