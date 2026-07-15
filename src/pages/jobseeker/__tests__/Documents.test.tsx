import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import Documents from '@/pages/jobseeker/Documents';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}));

const mockGet = api.get as unknown as Mock;
const mockPost = api.post as unknown as Mock;

function setup({
  docs = [] as unknown[],
  eligibility = 'PENDING',
  expiry = null as string | null,
  maxHours = null as number | null,
}) {
  mockGet.mockImplementation((url: string) => {
    if (url === '/documents/') return Promise.resolve({ data: docs });
    if (url === '/profile/me/') {
      return Promise.resolve({
        data: {
          eligibility_status: eligibility,
          work_rights_expiry: expiry,
          max_weekly_hours: maxHours,
        },
      });
    }
    return Promise.resolve({ data: null });
  });
}

describe('Documents', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  it('shows an empty state with no documents', async () => {
    setup({});
    render(<Documents />);
    expect(
      await screen.findByText(/no documents uploaded yet/i)
    ).toBeInTheDocument();
  });

  it('hides the CV from the documents table', async () => {
    setup({
      docs: [
        {
          id: 1,
          doc_type: 'CV',
          file: 'https://x/cv.pdf',
          status: 'PENDING',
          uploaded_at: '2026-07-14T00:00:00Z',
        },
        {
          id: 2,
          doc_type: 'VISA',
          file: 'https://x/visa.pdf',
          status: 'VERIFIED',
          uploaded_at: '2026-07-14T00:00:00Z',
        },
      ],
    });
    render(<Documents />);
    expect(await screen.findByText('visa.pdf')).toBeInTheDocument();
    expect(screen.queryByText('cv.pdf')).not.toBeInTheDocument();
  });

  it('shows eligibility details when eligible', async () => {
    setup({
      docs: [
        {
          id: 2,
          doc_type: 'VISA',
          file: 'https://x/visa.pdf',
          status: 'VERIFIED',
          uploaded_at: '2026-07-14T00:00:00Z',
        },
      ],
      eligibility: 'ELIGIBLE',
      expiry: '2027-05-04',
      maxHours: 25,
    });
    render(<Documents />);
    expect(
      await screen.findByText(/eligible to work in nz/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/25 hrs \/ week/i)).toBeInTheDocument();
  });

  it('disables the eligibility check when there are no documents', async () => {
    setup({});
    render(<Documents />);
    await screen.findByText(/no documents uploaded yet/i);
    expect(
      screen.getByRole('button', { name: /check my eligibility/i })
    ).toBeDisabled();
  });

  it('shows a review message when the check returns 202', async () => {
    setup({
      docs: [
        {
          id: 2,
          doc_type: 'VISA',
          file: 'https://x/visa.pdf',
          status: 'PENDING',
          uploaded_at: '2026-07-14T00:00:00Z',
        },
      ],
    });
    mockPost.mockResolvedValue({ status: 202, data: {} });
    render(<Documents />);
    const btn = await screen.findByRole('button', {
      name: /check my eligibility/i,
    });
    await userEvent.click(btn);
    await waitFor(() =>
      expect(screen.getByText(/sent for human review/i)).toBeInTheDocument()
    );
  });
});
