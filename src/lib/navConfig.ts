import type React from 'react';
import {
  LayoutDashboard,
  User,
  FileText,
  Mic2,
  FolderOpen,
  Briefcase,
  ClipboardList,
  MapPin,
  Plus,
  Building2,
  Users,
  Bot,
  BarChart3,
  BookOpen,
  Star,
  DollarSign,
  CreditCard,
} from 'lucide-react';

// Backend role values. WORKER is displayed as "Job Seeker" — label only.
export type Role = 'WORKER' | 'EMPLOYER' | 'TRAINER' | 'ADMIN';

export interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  soon?: boolean;
}

export const ROLE_LABELS: Record<Role, string> = {
  WORKER: 'Job Seeker',
  EMPLOYER: 'Employer',
  TRAINER: 'Trainer',
  ADMIN: 'Admin',
};

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  WORKER: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'My Profile', icon: User },
    { path: '/my-cv', label: 'My CV', icon: FileText },
    { path: '/interview', label: 'Screening Interview', icon: Mic2 },
    { path: '/documents', label: 'Documents', icon: FolderOpen },
    { path: '/jobs', label: 'Browse Jobs', icon: Briefcase },
    { path: '/applications', label: 'My Applications', icon: ClipboardList },
    { path: '/placements', label: 'My Placements', icon: MapPin },
    { path: '/cs/training', label: 'Training', icon: BookOpen, soon: true },
    { path: '/cs/reputation', label: 'Reputation', icon: Star, soon: true },
    { path: '/cs/earnings', label: 'Earnings', icon: DollarSign, soon: true },
  ],
  EMPLOYER: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'Venue Profile', icon: Building2 },
    { path: '/post-job', label: 'Post a Job', icon: Plus },
    { path: '/my-jobs', label: 'My Jobs', icon: Briefcase },
    { path: '/placements', label: 'Placements', icon: MapPin },
    { path: '/cs/reputation', label: 'Reputation', icon: Star, soon: true },
    { path: '/cs/billing', label: 'Billing', icon: CreditCard, soon: true },
  ],
  TRAINER: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'My Profile', icon: User },
    {
      path: '/cs/materials',
      label: 'Training Materials',
      icon: BookOpen,
      soon: true,
    },
    { path: '/cs/learners', label: 'My Learners', icon: Users, soon: true },
  ],
  ADMIN: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/accounts', label: 'Accounts', icon: Users },
    { path: '/review-queue', label: 'AI Review Queue', icon: Bot },
    {
      path: '/cs/metrics',
      label: 'Platform Metrics',
      icon: BarChart3,
      soon: true,
    },
  ],
};

export const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/profile': 'My Profile',
  '/my-cv': 'My CV',
  '/interview': 'Screening Interview',
  '/documents': 'Documents',
  '/jobs': 'Browse Jobs',
  '/applications': 'My Applications',
  '/placements': 'Placements',
  '/post-job': 'Post a Job',
  '/my-jobs': 'My Jobs',
  '/accounts': 'Accounts',
  '/review-queue': 'AI Review Queue',
};
