import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, Loader2, Info, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface Doc {
  id: number;
  doc_type: string;
  file: string;
  status: string;
  uploaded_at: string;
}

const DOC_TYPES = [
  { value: 'VISA', label: 'Visa' },
  { value: 'ID', label: 'ID' },
  { value: 'CERTIFICATE', label: 'Certificate' },
  { value: 'OTHER', label: 'Other' },
];

const STATUS_STYLES: Record<string, string> = {
  VERIFIED: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-amber-50 text-amber-700',
  REJECTED: 'bg-red-50 text-red-700',
  EXPIRED: 'bg-slate-100 text-slate-600',
};

const ELIGIBILITY_STYLES: Record<string, string> = {
  ELIGIBLE: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-amber-50 text-amber-700',
  NEEDS_REVIEW: 'bg-amber-50 text-amber-700',
  INELIGIBLE: 'bg-red-50 text-red-700',
};

const ELIGIBILITY_LABELS: Record<string, string> = {
  ELIGIBLE: 'Eligible to work in NZ',
  PENDING: 'Not checked yet',
  NEEDS_REVIEW: 'Needs human review',
  INELIGIBLE: 'Not eligible to work',
};

function fileNameFrom(url: string) {
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').pop() ?? 'file');
  } catch {
    return 'file';
  }
}

export default function Documents() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docType, setDocType] = useState('VISA');
  const [eligibility, setEligibility] = useState('PENDING');
  const [expiry, setExpiry] = useState<string | null>(null);
  const [maxHours, setMaxHours] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');

  async function loadAll() {
    const get = (url: string) => api.get(url).then((r) => r.data).catch(() => null);
    const [docsData, profile] = await Promise.all([get('/documents/'), get('/profile/me/')]);
    setDocs((docsData ?? []).filter((d: Doc) => d.doc_type !== 'CV'));
    if (profile) {
      setEligibility(profile.eligibility_status ?? 'PENDING');
      setExpiry(profile.work_rights_expiry ?? null);
      setMaxHours(profile.max_weekly_hours ?? null);
    }
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await loadAll();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    setMessage('');
    try {
      const form = new FormData();
      form.append('doc_type', docType);
      form.append('file', file);
      await api.post('/documents/', form);
      await loadAll();
    } catch {
      setMessage('Could not upload that file. Please try a PDF, JPG or PNG.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/documents/${id}/`);
      setDocs((d) => d.filter((x) => x.id !== id));
    } catch {
      setMessage('Could not delete that document.');
    }
  }

  async function handleCheckEligibility() {
    setChecking(true);
    setMessage('');
    try {
      const res = await api.post('/eligibility/check/');
      if (res.status === 202) {
        setMessage(
          'We could not assess your documents automatically. They have been sent for human review.',
        );
      }
      await loadAll();
    } catch {
      setMessage('Eligibility check failed. Please try again shortly.');
    } finally {
      setChecking(false);
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
    <div className="mx-auto max-w-6xl space-y-6">
      <p className="text-sm text-slate-500">
        Upload your visa, ID, or certificates for right-to-work verification.
      </p>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-semibold text-slate-800">Upload a document</h2>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            >
              {DOC_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <input
              ref={fileInput}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
            />

            <button
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-2.5 text-sm text-slate-500 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {uploading ? 'Uploading…' : 'Choose file or drag here'}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">PDF, JPG, or PNG</p>
          {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-semibold text-slate-800">Uploaded documents</h2>
          {docs.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No documents uploaded yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Filename</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Uploaded</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {d.doc_type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700">{fileNameFrom(d.file)}</td>
                    <td className="py-3">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-medium',
                          STATUS_STYLES[d.status] ?? 'bg-slate-100 text-slate-600',
                        )}
                      >
                        {d.status.charAt(0) + d.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(d.uploaded_at).toLocaleDateString('en-NZ')}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-slate-400 transition-colors hover:text-red-500"
                        aria-label={`Delete ${d.doc_type}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-slate-400" />
              <h2 className="font-semibold text-slate-800">Work eligibility</h2>
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                ELIGIBILITY_STYLES[eligibility] ?? 'bg-slate-100 text-slate-600',
              )}
            >
              {eligibility === 'ELIGIBLE' ? 'Eligible' : eligibility.replace('_', ' ')}
            </span>
          </div>

          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 px-4 py-4">
              <p className="text-xs text-slate-500">Status</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {ELIGIBILITY_LABELS[eligibility] ?? eligibility}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-4">
              <p className="text-xs text-slate-500">Work rights expire</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {expiry ? new Date(expiry).toLocaleDateString('en-NZ') : '—'}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-4">
              <p className="text-xs text-slate-500">Weekly hour limit</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {maxHours != null ? `${maxHours} hrs / week` : '—'}
              </p>
            </div>
          </div>

          <div className="mb-4 flex gap-3 rounded-lg bg-blue-50 p-4">
            <Info className="size-4 flex-shrink-0 text-blue-500" />
            <p className="text-sm text-blue-800">
              An AI reads your documents and extracts eligibility details automatically.
              Anything unclear is flagged for a human to review before your status is
              confirmed.
            </p>
          </div>

          <Button
            onClick={handleCheckEligibility}
            disabled={checking || docs.length === 0}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {checking ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Checking…
              </>
            ) : (
              'Check my eligibility'
            )}
          </Button>
          {docs.length === 0 && (
            <p className="mt-2 text-xs text-slate-400">
              Upload at least one document before checking.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
