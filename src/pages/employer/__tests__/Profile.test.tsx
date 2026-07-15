import { render, screen } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import EmployerProfile from '@/pages/employer/Profile';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), patch: vi.fn(), post: vi.fn() },
}));
const mockGet = api.get as unknown as Mock;

describe('EmployerProfile', () => {
  beforeEach(() => mockGet.mockReset());

  it('shows venue and contact details', async () => {
    mockGet.mockResolvedValue({
      data: {
        user: { email: 'e@test.com', first_name: 'Sam', last_name: 'Lee', phone: '', country_code: '+64', address: '' },
        venue_name: 'The Occidental',
        venue_type: 'Bar',
        location: 'Auckland CBD',
        description: 'Belgian beer cafe',
      },
    });
    render(<EmployerProfile />);
    expect(await screen.findByDisplayValue('The Occidental')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Auckland CBD')).toBeInTheDocument();
    expect(screen.getByDisplayValue('e@test.com')).toBeDisabled();
  });
});
