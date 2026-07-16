import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChangePasswordCard } from '@/components/common/ChangePasswordCard';
import api from '@/lib/api';

interface EmployerData {
  user: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    country_code: string;
    address: string;
  };
  venue_name: string;
  venue_type: string;
  location: string;
  description: string;
}

export default function EmployerProfile() {
  const [data, setData] = useState<EmployerData | null>(null);
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

  function setField<K extends keyof EmployerData>(
    key: K,
    value: EmployerData[K]
  ) {
    setData((d) => (d ? { ...d, [key]: value } : d));
  }
  function setUser(key: keyof EmployerData['user'], value: string) {
    setData((d) => (d ? { ...d, user: { ...d.user, [key]: value } } : d));
  }

  async function save() {
    if (!data) return;
    setSaving(true);
    setMsg(null);
    try {
      await api.patch('/profile/me/', {
        venue_name: data.venue_name,
        venue_type: data.venue_type,
        location: data.location,
        description: data.description,
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
  if (!data)
    return (
      <p className="text-sm text-slate-500">Couldn&apos;t load your profile.</p>
    );

  const input =
    'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-5 font-semibold text-slate-800">Venue details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                Venue name
              </label>
              <input
                value={data.venue_name}
                onChange={(e) => setField('venue_name', e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                Venue type
              </label>
              <input
                value={data.venue_type}
                onChange={(e) => setField('venue_type', e.target.value)}
                placeholder="Cafe, bar, restaurant…"
                className={input}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                Location
              </label>
              <input
                value={data.location}
                onChange={(e) => setField('location', e.target.value)}
                className={input}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                Description
              </label>
              <textarea
                value={data.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={3}
                className={`${input} resize-none`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-5 font-semibold text-slate-800">Contact details</h2>
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

      <ChangePasswordCard />
    </div>
  );
}
