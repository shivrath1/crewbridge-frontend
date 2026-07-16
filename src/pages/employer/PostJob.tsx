import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role_title: '',
    description: '',
    start_datetime: '',
    duration_hours: '',
    pay_rate: '',
    positions_needed: '1',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  // Local datetime string for the input's min (now, rounded to the minute).
  const [nowLocal] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    if (new Date(form.start_datetime) <= new Date()) {
      setError('The shift start time must be in the future.');
      return;
    }
    try {
      await api.post('/jobs/', {
        role_title: form.role_title,
        description: form.description,
        start_datetime: new Date(form.start_datetime).toISOString(),
        duration_hours: Number(form.duration_hours),
        pay_rate: form.pay_rate,
        positions_needed: Number(form.positions_needed),
        status: 'OPEN',
      });
      navigate('/my-jobs');
    } catch (err) {
      const detail =
        (err as { response?: { data?: Record<string, unknown> } }).response?.data;
      setError(
        typeof detail === 'object' && detail
          ? Object.values(detail).flat().join(' ')
          : 'Could not post the job. Please check the fields.',
      );
    } finally {
      setSaving(false);
    }
  }

  const input =
    'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30';

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-1 font-semibold text-slate-800">Post a job</h2>
          <p className="mb-6 text-sm text-slate-500">
            Describe the shift you need staffed. Only screened, eligible candidates will
            be shortlisted.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Role title</label>
              <input required value={form.role_title} onChange={(e) => set('role_title', e.target.value)} placeholder="Bartender, Barista, Wait Staff…" className={input} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="What the shift involves, any requirements…" className={`${input} resize-none`} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Start date &amp; time</label>
                <input required type="datetime-local" min={nowLocal} value={form.start_datetime} onChange={(e) => set('start_datetime', e.target.value)} className={input} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Duration (hours)</label>
                <input required type="number" min="1" step="0.5" value={form.duration_hours} onChange={(e) => set('duration_hours', e.target.value)} className={input} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Pay rate ($/hr)</label>
                <input required type="number" min="0" step="0.01" value={form.pay_rate} onChange={(e) => set('pay_rate', e.target.value)} className={input} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Positions needed</label>
                <input required type="number" min="1" value={form.positions_needed} onChange={(e) => set('positions_needed', e.target.value)} className={input} />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={saving} className="bg-emerald-600 text-white hover:bg-emerald-700">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <><Plus className="mr-1 size-4" /> Post job</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
