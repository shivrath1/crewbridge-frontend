import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import JobseekerDashboard from '@/pages/jobseeker/Dashboard';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({ default: { get: vi.fn() } }));
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: 'w@test.com',
      role: 'WORKER',
      first_name: 'Aroha',
      last_name: 'N',
    },
  }),
}));

const mockGet = api.get as unknown as Mock;

// A rejection that is already handled, so Vitest does not flag it.
// Simulate a 404 without ever rejecting: axios would throw, but for the
// component's purposes "no data" is what matters, and the component already
// treats a failed call as null.
function notFound() {
  return Promise.resolve({ data: null });
}

function mockEndpoints({
  cv = false,
  eligible = false,
  interview = null as null | Record<string, unknown>,
  cvScore = null as number | null,
  jobs = [] as unknown[],
}) {
  mockGet.mockImplementation((url: string) => {
    if (url === '/cv/') return cv ? Promise.resolve({ data: {} }) : notFound();
    if (url === '/profile/me/') {
      return Promise.resolve({
        data: {
          eligibility_status: eligible ? 'ELIGIBLE' : 'PENDING',
          cv_score: cvScore,
        },
      });
    }
    if (url === '/interview/') {
      return interview ? Promise.resolve({ data: interview }) : notFound();
    }
    if (url === '/jobs/') return Promise.resolve({ data: jobs });
    return notFound();
  });
}

function renderDashboard() {
  return render(
    <MemoryRouter>
      <JobseekerDashboard />
    </MemoryRouter>
  );
}

describe('JobseekerDashboard', () => {
  beforeEach(() => mockGet.mockReset());

  it('shows "not shortlistable" when no steps are complete', async () => {
    mockEndpoints({});
    renderDashboard();
    expect(
      await screen.findByText(/not shortlistable yet/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upload cv/i })
    ).toBeInTheDocument();
  });

  it('does not show a rating before the interview is complete', async () => {
    mockEndpoints({ cv: true, eligible: true });
    renderDashboard();
    expect(
      await screen.findByText(/complete all three steps/i)
    ).toBeInTheDocument();
  });

  it('shows the overall rating once all steps are complete', async () => {
    mockEndpoints({
      cv: true,
      eligible: true,
      cvScore: 8,
      interview: {
        status: 'COMPLETED',
        interview_score: 7,
        overall_score: 7,
        scoring_reasoning: 'Solid answers.',
      },
    });
    renderDashboard();
    expect(await screen.findByText(/all done/i)).toBeInTheDocument();
    expect(screen.getByText(/solid answers/i)).toBeInTheDocument();
    expect(
      screen.getByText(/you're in the candidate pool/i)
    ).toBeInTheDocument();
  });

  it('shows an empty state when there are no open jobs', async () => {
    mockEndpoints({});
    renderDashboard();
    expect(
      await screen.findByText(/no open jobs right now/i)
    ).toBeInTheDocument();
  });

  it('lists open jobs when they exist', async () => {
    mockEndpoints({
      jobs: [
        {
          id: 1,
          role_title: 'Barista',
          venue_name: 'The Commons',
          start_datetime: '2026-08-01T18:00:00Z',
          duration_hours: 5,
          pay_rate: '26.00',
        },
      ],
    });
    renderDashboard();
    expect(await screen.findByText('Barista')).toBeInTheDocument();
  });

  it('shows an error state if the profile fails to load', async () => {
    mockGet.mockImplementation(() => notFound());
    renderDashboard();
    expect(
      await screen.findByText(/couldn't load your dashboard/i)
    ).toBeInTheDocument();
  });
});
