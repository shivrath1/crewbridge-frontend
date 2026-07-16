import { useEffect, useState } from 'react';
import { Loader2, Bot, Check, X, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface Flag {
  id: number;
  source: string;
  reason: string;
  status: string;
  subject: string;
  subject_type: string;
  created_at: string;
}

export default function ReviewQueue() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);

  async function load() {
    const data = await api.get('/admin/review-queue/').then((r) => r.data).catch(() => []);
    setFlags(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function decide(id: number, status: 'APPROVED' | 'REJECTED') {
    setBusy(id);
    try {
      await api.patch(`/admin/review-queue/${id}/`, { status });
      setFlags((prev) => prev.filter((f) => f.id !== id));
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
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3">
        <ShieldCheck className="size-5 flex-shrink-0 text-blue-500" />
        <p className="text-sm text-blue-800">
          These items were flagged by the AI because it wasn&apos;t confident enough to
          decide automatically. Your decision here is final.
        </p>
      </div>

      {flags.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Check className="size-8 text-emerald-300" />
            <p className="text-sm font-medium text-slate-600">Nothing to review</p>
            <p className="text-sm text-slate-400">The queue is clear.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {flags.map((f) => (
            <Card key={f.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {f.subject_type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Bot className="size-3" /> {f.source}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800">{f.subject}</h3>
                    <p className="mt-1 text-sm text-slate-600">{f.reason}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(f.created_at).toLocaleString('en-NZ', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <Button
                      onClick={() => decide(f.id, 'REJECTED')}
                      disabled={busy === f.id}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="mr-1 size-4" /> Reject
                    </Button>
                    <Button
                      onClick={() => decide(f.id, 'APPROVED')}
                      disabled={busy === f.id}
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      {busy === f.id ? <Loader2 className="size-4 animate-spin" /> : <><Check className="mr-1 size-4" /> Approve</>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
