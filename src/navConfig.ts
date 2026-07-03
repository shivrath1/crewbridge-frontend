export type NavItem = { label: string; path: string };

export const NAV_BY_ROLE: Record<string, NavItem[]> = {
  WORKER: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My profile', path: '/profile' },
    { label: 'Documents', path: '/documents' },
    { label: 'Browse jobs', path: '/jobs' },
    { label: 'My placements', path: '/placements' },
  ],
  EMPLOYER: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Venue profile', path: '/profile' },
    { label: 'Post a job', path: '/post-job' },
    { label: 'My jobs', path: '/jobs' },
    { label: 'Applicants', path: '/applicants' },
  ],
  TRAINER: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My profile', path: '/profile' },
    { label: 'Materials', path: '/materials' },
  ],
  ADMIN: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Accounts', path: '/accounts' },
    { label: 'AI review queue', path: '/review-queue' },
  ],
};
