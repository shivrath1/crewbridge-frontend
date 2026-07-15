import { render, screen } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import MyApplications from '@/pages/jobseeker/MyApplications';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({ default: { get: vi.fn() } }));
const mockGet = api.get as unknown as Mock;

describe('MyApplications', () => {
  beforeEach(() => mockGet.mockReset());

  it('shows an empty state with no applications', async () => {
    mockGet.mockResolvedValue({ data: [] });
    render(<MyApplications />);
    expect(await screen.findByText(/no applications yet/i)).toBeInTheDocument();
  });

  it('lists applications with venue, date and status', async () => {
    mockGet.mockResolvedValue({
      data: [
        {
          id: 1,
          job_title: 'Bartender',
          venue_name: 'The Occidental',
          job_start: '2026-07-20T18:00:00Z',
          status: 'SHORTLISTED',
          applied_at: '2026-07-15T00:00:00Z',
        },
      ],
    });
    render(<MyApplications />);
    expect(await screen.findByText('Bartender')).toBeInTheDocument();
    expect(screen.getByText('The Occidental')).toBeInTheDocument();
    expect(screen.getByText('Shortlisted')).toBeInTheDocument();
  });
});
