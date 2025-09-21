// Navigation and Menu Types for DANTAM Healthcare System

import { LucideIcon } from 'lucide-react';
import { UserRole } from './user';

export interface NavigationItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
  description?: string;
  badge?: string | number;
  requiredRoles?: UserRole[];
  children?: NavigationItem[];
  isExternal?: boolean;
}

export interface NavigationGroup {
  id: string;
  title: string;
  items: NavigationItem[];
  requiredRoles?: UserRole[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
  isCurrentPage?: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: LucideIcon;
  action: () => void;
  variant?: 'default' | 'primary' | 'secondary';
  requiredRoles?: UserRole[];
}