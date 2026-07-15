import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import JobSeekerProfile from '@/pages/jobseeker/Profile';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), patch: vi.fn(), post: vi.fn() },
}));

const mockGet = api.get as unknown as Mock;
const mockPatch = api.patch as unknown as Mock;

const PROFILE = {
  user: {
    email: 'w@test.com',
    first_name: 'Aroha',
    last_name: 'Ngata',
    phone: '021 555',
    country_code: '+64',
    address: 'Auckland',
  },
  eligibility_status: 'ELIGIBLE',
  max_weekly_hours: 25,
  work_rights_expiry: '2027-05-04',
};

describe('JobSeekerProfile', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPatch.mockReset();
  });

  it('loads and shows personal details and eligibility', async () => {
    mockGet.mockResolvedValue({ data: PROFILE });
    render(<JobSeekerProfile />);
    expect(await screen.findByDisplayValue('Aroha')).toBeInTheDocument();
    expect(screen.getByDisplayValue('w@test.com')).toBeDisabled();
    expect(screen.getByText(/eligible to work/i)).toBeInTheDocument();
    expect(screen.getByText('25 hrs')).toBeInTheDocument();
  });

  it('saves edited details via a nested user patch', async () => {
    mockGet.mockResolvedValue({ data: PROFILE });
    mockPatch.mockResolvedValue({ data: PROFILE });
    render(<JobSeekerProfile />);

    const firstName = await screen.findByDisplayValue('Aroha');
    await userEvent.clear(firstName);
    await userEvent.type(firstName, 'Kiri');
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith(
        '/profile/me/',
        expect.objectContaining({
          user: expect.objectContaining({ first_name: 'Kiri' }),
        }),
      );
    });
  });
});
