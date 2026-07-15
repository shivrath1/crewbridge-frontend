import { useEffect, useRef, useState } from 'react';
import { Upload, FileText, Bot, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface CVDoc {
  id: number;
  file: string;
  uploaded_at: string;
}

interface Analysis {
  detected_domain: string;
  years_experience: number;
  relevant_roles: string[];
  relevant_skills: string[];
  cv_score: number;
  reasoning: string;
}

function fileNameFrom(url: string) {
  try {
    const path = new URL(url).pathname;
    return decodeURIComponent(path.split('/').pop() ?? 'CV');
  } catch {
    return 'CV';
  }
}

export default function MyCV() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [cv, setCv] = useState<CVDoc | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  // const [cvScore, setCvScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [message, setMessage] = useState('');
  const [needsReview, setNeedsReview] = useState(false);

  useEffect(() => {
    async function load() {
      const get = (url: string) =>
        api
          .get(url)
          .then((r) => r.data)
          .catch(() => null);
      const [cvData, profile] = await Promise.all([
        get('/cv/'),
        get('/profile/me/'),
      ]);
      setCv(cvData);
      // if (profile?.cv_score != null) setCvScore(profile.cv_score);
      // Restore the full breakdown if it has already been analysed.
      if (profile?.cv_analysis && Object.keys(profile.cv_analysis).length > 0) {
        setAnalysis(profile.cv_analysis);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    setMessage('');
    setNeedsReview(false);
    setAnalysis(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/cv/', form);
      setCv(res.data);
      //setCvScore(null);
      setUploading(false);
      // Analysis is required before the interview can be generated — just run it.
      await handleAnalyse();
      return;
      //setMessage('CV uploaded. Run the analysis to tailor your interview.');
    } catch {
      setMessage('Could not upload that file. Please try a PDF, DOCX or TXT.');
    } finally {
      setUploading(false);
    }
  }

  async function handleAnalyse() {
    setAnalysing(true);
    setMessage('');
    setNeedsReview(false);
    try {
      const res = await api.post('/cv/analyse/');
      if (res.status === 202) {
        setNeedsReview(true);
      } else {
        setAnalysis(res.data);
        //setCvScore(res.data.cv_score);
      }
    } catch {
      setMessage('Analysis failed. Please try again in a moment.');
    } finally {
      setAnalysing(false);
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
      <div>
        <p className="text-sm text-slate-500">
          Your CV is read by AI to generate your screening interview questions.
          Upload a clear, up-to-date version.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-semibold text-slate-800">Upload your CV</h2>

          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />

          {cv ? (
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-white">
                  <FileText className="size-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {fileNameFrom(cv.file)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Uploaded{' '}
                    {new Date(cv.uploaded_at).toLocaleDateString('en-NZ')}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Replace'
                )}
              </Button>
            </div>
          ) : (
            <button
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-10 text-slate-500 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              {uploading ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                <Upload className="size-6" />
              )}
              <span className="text-sm font-medium">
                {uploading ? 'Uploading…' : 'Choose a file to upload'}
              </span>
              <span className="text-xs text-slate-400">PDF, DOCX or TXT</span>
            </button>
          )}

          {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}

          {cv && (
            <Button
              onClick={handleAnalyse}
              disabled={analysing}
              className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {analysing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Analysing
                  your CV…
                </>
              ) : (
                <>
                  <Bot className="mr-2 size-4" /> Analyse my CV
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {needsReview && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex gap-3 p-5">
            <AlertTriangle className="size-5 flex-shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                We couldn&apos;t read your CV automatically
              </p>
              <p className="mt-1 text-sm text-amber-800">
                It has been sent to our team for a human review. You can also
                try uploading a clearer version — a text-based PDF works best.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-emerald-500" />
                <h2 className="font-semibold text-slate-800">AI CV Analysis</h2>
              </div>
              <span className="text-xs text-slate-400">
                AI-generated · a human reviews any flags
              </span>
            </div>

            <div className="mb-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-emerald-50 py-5 text-center">
                <p className="text-4xl font-extrabold text-emerald-700">
                  {analysis.cv_score}
                </p>
                <p className="mt-1 text-xs text-emerald-700">CV score / 10</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-4 py-5">
                <p className="text-xs text-slate-500">Industry</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {analysis.detected_domain}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-4 py-5">
                <p className="text-xs text-slate-500">Experience</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  ~{analysis.years_experience} years
                </p>
              </div>
            </div>

            {analysis.relevant_roles?.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-xs text-slate-500">Previous roles</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.relevant_roles.map((r) => (
                    <span
                      key={r}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.relevant_skills?.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-xs text-slate-500">Skills detected</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.relevant_skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.reasoning && (
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="mb-1 text-xs font-medium text-slate-500">
                  AI reasoning
                </p>
                <p className="text-sm leading-relaxed text-slate-700">
                  {analysis.reasoning}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* {!analysis && !needsReview && cvScore != null && (
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <CheckCircle2 className="size-5 text-emerald-500" />
            <p className="text-sm text-slate-700">
              Your CV has already been analysed — score{' '}
              <strong>{cvScore}/10</strong>. Run the analysis again to see the full
              breakdown.
            </p>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
