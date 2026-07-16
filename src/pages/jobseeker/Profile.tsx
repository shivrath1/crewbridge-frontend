import { useEffect, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChangePasswordCard } from '@/components/common/ChangePasswordCard';
import api from '@/lib/api';

interface ProfileData {
  user: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    country_code: string;
    address: string;
  };
  eligibility_status: string;
  max_weekly_hours: number | null;
  work_rights_expiry: string | null;
}

export default function JobSeekerProfile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    async function load() {
      const d = await api
        .get('/profile/me/')
        .then((r) => r.data)
        .catch(() => null);
      setData(d);
      setLoading(false);
    }
    load();
  }, []);

  function setUser<K extends keyof ProfileData['user']>(key: K, value: string) {
    setData((d) => (d ? { ...d, user: { ...d.user, [key]: value } } : d));
  }

  async function save() {
    if (!data) return;
    if (!data.user.first_name.trim() || !data.user.last_name.trim()) {
      setMsg({ text: 'First and last name are required.', ok: false });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await api.patch('/profile/me/', {
        user: {
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          phone: data.user.phone,
          country_code: data.user.country_code,
          address: data.user.address,
        },
      });
      setMsg({ text: 'Profile saved.', ok: true });
    } catch {
      setMsg({ text: 'Could not save. Please try again.', ok: false });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="mr-2 size-5 animate-spin" /> Loading…
      </div>
    );
  }
  if (!data) {
    return (
      <p className="text-sm text-slate-500">Couldn&apos;t load your profile.</p>
    );
  }

  const input =
    'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-5 font-semibold text-slate-800">
            Personal details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                First name
              </label>
              <input
                value={data.user.first_name}
                onChange={(e) => setUser('first_name', e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                Last name
              </label>
              <input
                value={data.user.last_name}
                onChange={(e) => setUser('last_name', e.target.value)}
                className={input}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                Email
              </label>
              <input
                value={data.user.email}
                disabled
                className={`${input} cursor-not-allowed bg-slate-100 text-slate-500`}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                Country code
              </label>
              <input
                value={data.user.country_code}
                onChange={(e) => setUser('country_code', e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                Phone
              </label>
              <input
                value={data.user.phone}
                onChange={(e) => setUser('phone', e.target.value)}
                className={input}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                Address
              </label>
              <input
                value={data.user.address}
                onChange={(e) => setUser('address', e.target.value)}
                className={input}
              />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Button
              onClick={save}
              disabled={saving}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Save changes'
              )}
            </Button>
            {msg && (
              <span
                className={
                  msg.ok ? 'text-sm text-emerald-600' : 'text-sm text-red-600'
                }
              >
                {msg.text}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="size-4 text-slate-400" />
            <h2 className="font-semibold text-slate-800">Work eligibility</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Status</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {data.eligibility_status === 'ELIGIBLE'
                  ? 'Eligible to work'
                  : data.eligibility_status.replace('_', ' ')}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Weekly hour limit</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {data.max_weekly_hours != null
                  ? `${data.max_weekly_hours} hrs`
                  : '—'}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Work rights expire</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {data.work_rights_expiry
                  ? new Date(data.work_rights_expiry).toLocaleDateString(
                      'en-NZ'
                    )
                  : '—'}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            These are set from your documents by our verification process, and
            can&apos;t be edited here.
          </p>
        </CardContent>
      </Card>

      <ChangePasswordCard />
    </div>
  );
}
