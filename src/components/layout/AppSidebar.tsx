import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
  Package,
  Settings,
  Stethoscope,
  ChevronRight,
  Activity,
  UserPlus,
  Search,
  ClipboardList,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NavigationGroup, NavigationItem } from '@/types/navigation';
import { UserRole } from '@/types/user';

// Mock user for demo - replace with actual auth context
const mockUser = {
  id: '1',
  email: 'dr.smith@dantam.com',
  firstName: 'John',
  lastName: 'Smith',
  role: 'doctor' as UserRole,
  clinicId: 'clinic-1',
  avatar: undefined,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const navigationGroups: NavigationGroup[] = [
  {
    id: 'overview',
    title: 'Overview',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        description: 'Analytics and key metrics',
        requiredRoles: ['super_admin', 'clinic_admin', 'doctor', 'hygienist', 'receptionist'],
      },
    ],
  },
  {
    id: 'patient-care',
    title: 'Patient Care',
    items: [
      {
        id: 'patients',
        title: 'Patient Management',
        icon: Users,
        href: '/patients',
        description: 'Patient directory and records',
        requiredRoles: ['super_admin', 'clinic_admin', 'doctor', 'hygienist', 'receptionist'],
        children: [
          {
            id: 'patient-directory',
            title: 'Patient Directory',
            icon: Search,
            href: '/patients',
            requiredRoles: ['super_admin', 'clinic_admin', 'doctor', 'hygienist', 'receptionist'],
          },
          {
            id: 'add-patient',
            title: 'Add New Patient',
            icon: UserPlus,
            href: '/patients/new',
            requiredRoles: ['super_admin', 'clinic_admin', 'doctor', 'receptionist'],
          },
        ],
      },
      {
        id: 'appointments',
        title: 'Appointments',
        icon: Calendar,
        href: '/scheduling',
        description: 'Scheduling and calendar management',
        badge: '12',
        requiredRoles: ['super_admin', 'clinic_admin', 'doctor', 'hygienist', 'receptionist'],
      },
    ],
  },
  {
    id: 'business',
    title: 'Business Operations',
    items: [
      {
        id: 'billing',
        title: 'Billing & Payments',
        icon: CreditCard,
        href: '/financial',
        description: 'Financial management',
        requiredRoles: ['super_admin', 'clinic_admin', 'doctor', 'receptionist'],
      },
      {
        id: 'communications',
        title: 'COMMS',
        icon: MessageSquare,
        href: '/communications',
        description: 'Patient messaging and campaigns',
        requiredRoles: ['super_admin', 'clinic_admin', 'doctor', 'receptionist'],
      },
    ],
  },
  {
    id: 'system',
    title: 'System',
    items: [
      {
        id: 'settings',
        title: 'Settings',
        icon: Settings,
        href: '/settings',
        description: 'System configuration',
        requiredRoles: ['super_admin', 'clinic_admin'],
      },
    ],
  },
];

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const hasPermission = (requiredRoles?: UserRole[]) => {
    if (!requiredRoles) return true;
    return requiredRoles.includes(mockUser.role);
  };

  const isActive = (href: string) => {
    if (href === '/') return currentPath === href;
    return currentPath.startsWith(href);
  };

  const getNavClasses = (href: string) => {
    return isActive(href) 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";
  };

  return (
    <Sidebar className={className} collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="h-6 w-6" />
          </div>
          {state === 'expanded' && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold">DANTAM</span>
              <span className="text-xs text-sidebar-foreground/70">Dental Practice Management</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.id} className="mb-4">
            {state === 'expanded' && (
              <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70 mb-2">
                {group.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  if (!hasPermission(item.requiredRoles)) return null;

                  if (item.children && item.children.length > 0) {
                    return (
                      <SidebarMenuItem key={item.id}>
                        <Collapsible 
                          defaultOpen={item.children.some(child => isActive(child.href))}
                          className="w-full"
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              className={`w-full justify-between ${getNavClasses(item.href)}`}
                              tooltip={state === 'collapsed' ? item.title : undefined}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4" />
                                {state === 'expanded' && (
                                  <>
                                    <span>{item.title}</span>
                                    {item.badge && (
                                      <Badge variant="secondary" className="ml-auto">
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </>
                                )}
                              </div>
                              {state === 'expanded' && (
                                <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                              )}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.children.map((child) => {
                                if (!hasPermission(child.requiredRoles)) return null;
                                return (
                                  <SidebarMenuSubItem key={child.id}>
                                    <SidebarMenuSubButton asChild>
                                      <NavLink 
                                        to={child.href} 
                                        className={({ isActive }) => 
                                          isActive 
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                                            : "hover:bg-sidebar-accent/50"
                                        }
                                      >
                                        <child.icon className="h-4 w-4" />
                                        <span>{child.title}</span>
                                      </NavLink>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={state === 'collapsed' ? item.title : undefined}
                      >
                        <NavLink 
                          to={item.href} 
                          className={({ isActive }) => 
                            isActive 
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                              : "hover:bg-sidebar-accent/50"
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          {state === 'expanded' && (
                            <>
                              <span>{item.title}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-auto">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

    </Sidebar>
  );
}
