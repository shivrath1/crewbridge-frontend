import { render, screen } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import MyPlacements from '@/pages/jobseeker/MyPlacements';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({ default: { get: vi.fn() } }));
const mockGet = api.get as unknown as Mock;

describe('MyPlacements', () => {
  beforeEach(() => mockGet.mockReset());

  it('shows an empty state with no placements', async () => {
    mockGet.mockResolvedValue({ data: [] });
    render(<MyPlacements />);
    expect(await screen.findByText(/no placements yet/i)).toBeInTheDocument();
  });

  it('lists confirmed placements', async () => {
    mockGet.mockResolvedValue({
      data: [
        {
          id: 1,
          job_title: 'Bartender',
          venue_name: 'Housebar',
          job_start: '2026-07-20T19:00:00Z',
          status: 'CONFIRMED',
        },
      ],
    });
    render(<MyPlacements />);
    expect(await screen.findByText('Bartender')).toBeInTheDocument();
    expect(screen.getByText('Housebar')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });
});
