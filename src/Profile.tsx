import { useState, useEffect, type FormEvent } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/profile/me/')
      .then((res) => setForm(res.data))
      .catch(() => setMessage('Could not load profile.'))
      .finally(() => setLoading(false));
  }, []);

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await api.patch('/profile/me/', form);
      setForm(res.data);
      setMessage('Saved.');
    } catch {
      setMessage('Could not save.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: 480 }}>
      <h2>{user?.role === 'EMPLOYER' ? 'Venue profile' : 'My profile'}</h2>
      <form onSubmit={handleSubmit}>
        {user?.role === 'WORKER' && (
          <>
            <Field
              label="Bio"
              value={form.bio}
              onChange={(v) => update('bio', v)}
              textarea
            />
            <Field
              label="Skills"
              value={form.skills_text}
              onChange={(v) => update('skills_text', v)}
            />
            <Field
              label="Experience (years)"
              type="number"
              value={form.experience_years}
              onChange={(v) => update('experience_years', Number(v))}
            />
            <Field
              label="Max weekly hours"
              type="number"
              value={form.max_weekly_hours}
              onChange={(v) => update('max_weekly_hours', Number(v))}
            />
            <p style={{ fontSize: 13, color: '#666' }}>
              Eligibility: <strong>{String(form.eligibility_status)}</strong>{' '}
              (set by review)
            </p>
          </>
        )}

        {user?.role === 'EMPLOYER' && (
          <>
            <Field
              label="Venue name"
              value={form.venue_name}
              onChange={(v) => update('venue_name', v)}
            />
            <Field
              label="Venue type"
              value={form.venue_type}
              onChange={(v) => update('venue_type', v)}
            />
            <Field
              label="Location"
              value={form.location}
              onChange={(v) => update('location', v)}
            />
            <Field
              label="Description"
              value={form.description}
              onChange={(v) => update('description', v)}
              textarea
            />
          </>
        )}

        {user?.role === 'TRAINER' && (
          <>
            <Field
              label="Bio"
              value={form.bio}
              onChange={(v) => update('bio', v)}
              textarea
            />
            <Field
              label="Specialties"
              value={form.specialties}
              onChange={(v) => update('specialties', v)}
            />
          </>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{ padding: 10, marginTop: 8 }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {message && (
          <span style={{ marginLeft: 12, color: '#185FA5' }}>{message}</span>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
}: {
  label: string;
  value: unknown;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          color: '#555',
          marginBottom: 3,
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '100%', padding: 8, minHeight: 60 }}
        />
      ) : (
        <input
          type={type}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
      )}
    </div>
  );
}
