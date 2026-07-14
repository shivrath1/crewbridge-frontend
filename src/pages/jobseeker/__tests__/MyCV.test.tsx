import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import MyCV from '@/pages/jobseeker/MyCV';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

const mockGet = api.get as unknown as Mock;
const mockPost = api.post as unknown as Mock;

const ANALYSIS = {
  detected_domain: 'Hospitality',
  years_experience: 5,
  relevant_roles: ['Bartender'],
  relevant_skills: ['Coffee'],
  cv_score: 8,
  reasoning: 'Strong hospitality background.',
};

function mockProfile({
  cv = null as unknown,
  cvScore = null as number | null,
  analysis = {} as Record<string, unknown>,
}) {
  mockGet.mockImplementation((url: string) => {
    if (url === '/cv/') return Promise.resolve({ data: cv });
    if (url === '/profile/me/') {
      return Promise.resolve({ data: { cv_score: cvScore, cv_analysis: analysis } });
    }
    return Promise.resolve({ data: null });
  });
}

describe('MyCV', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  it('shows the upload dropzone when no CV exists', async () => {
    mockProfile({});
    render(<MyCV />);
    expect(await screen.findByText(/choose a file to upload/i)).toBeInTheDocument();
  });

  it('shows the existing CV and a replace action', async () => {
    mockProfile({
      cv: { id: 1, file: 'https://x.blob.core.windows.net/d/cv.pdf', uploaded_at: '2026-07-14T00:00:00Z' },
    });
    render(<MyCV />);
    expect(await screen.findByText('cv.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /replace/i })).toBeInTheDocument();
  });

  it('restores a previous analysis on load', async () => {
    mockProfile({
      cv: { id: 1, file: 'https://x/cv.pdf', uploaded_at: '2026-07-14T00:00:00Z' },
      cvScore: 8,
      analysis: ANALYSIS,
    });
    render(<MyCV />);
    expect(await screen.findByText('AI CV Analysis')).toBeInTheDocument();
    expect(screen.getByText('Hospitality')).toBeInTheDocument();
    expect(screen.getByText('Bartender')).toBeInTheDocument();
    expect(screen.getByText(/strong hospitality background/i)).toBeInTheDocument();
  });

  it('runs the analysis automatically after an upload', async () => {
    mockProfile({});
    mockPost.mockImplementation((url: string) => {
      if (url === '/cv/') {
        return Promise.resolve({
          data: { id: 1, file: 'https://x/new.pdf', uploaded_at: '2026-07-14T00:00:00Z' },
        });
      }
      if (url === '/cv/analyse/') {
        return Promise.resolve({ status: 200, data: ANALYSIS });
      }
      return Promise.resolve({ data: null });
    });

    render(<MyCV />);
    const input = await screen.findByText(/choose a file to upload/i);
    expect(input).toBeInTheDocument();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['cv content'], 'cv.pdf', { type: 'application/pdf' });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/cv/analyse/');
    });
    expect(await screen.findByText('AI CV Analysis')).toBeInTheDocument();
  });

  it('shows a human-review message when the CV cannot be read', async () => {
    mockProfile({
      cv: { id: 1, file: 'https://x/cv.pdf', uploaded_at: '2026-07-14T00:00:00Z' },
    });
    mockPost.mockResolvedValue({ status: 202, data: {} });

    render(<MyCV />);
    const btn = await screen.findByRole('button', { name: /analyse my cv/i });
    await userEvent.click(btn);

    expect(
      await screen.findByText(/couldn't read your cv automatically/i),
    ).toBeInTheDocument();
  });
});
