import React, { useState } from 'react';
import { Bell, ChevronDown, MapPin, Settings, LogOut, User, Stethoscope } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

// Mock data for demo - replace with actual data
const mockUser = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'dr.smith@dantam.com',
  role: 'Doctor',
  avatar: undefined,
};

const mockClinics = [
  { id: '1', name: 'Downtown Dental Center', address: 'Mumbai, Maharashtra' },
  { id: '2', name: 'Green Valley Clinic', address: 'Delhi, India' },
  { id: '3', name: 'Smile Care Dental', address: 'Bangalore, Karnataka' },
];

const mockNotifications = [
  { id: '1', title: 'New appointment scheduled', time: '5 min ago', type: 'appointment' },
  { id: '2', title: 'Payment received from Patient #1234', time: '15 min ago', type: 'payment' },
  { id: '3', title: 'Lab results ready for review', time: '1 hour ago', type: 'lab' },
];

interface AppHeaderProps {
  breadcrumbs?: { title: string; href?: string; isCurrentPage?: boolean }[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
  const [selectedClinic, setSelectedClinic] = useState(mockClinics[0]);
  const { signOut, user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-surface px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {breadcrumb.isCurrentPage ? (
                      <BreadcrumbPage className="font-medium">
                        {breadcrumb.title}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink 
                        href={breadcrumb.href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {breadcrumb.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Clinic Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 px-3">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{selectedClinic.name}</span>
              <span className="sm:hidden">Clinic</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Select Clinic</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockClinics.map((clinic) => (
              <DropdownMenuItem
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic)}
                className="flex flex-col items-start"
              >
                <span className="font-medium">{clinic.name}</span>
                <span className="text-sm text-muted-foreground">{clinic.address}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {mockNotifications.length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-semibold">
              Notifications ({mockNotifications.length})
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                <span className="font-medium text-sm">{notification.title}</span>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-2">
              <Avatar className="h-7 w-7 mr-2">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline font-medium">
                {user?.email?.split('@')[0] || 'User'}
              </span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.email}</span>
                <span className="text-xs text-muted-foreground">Dental Professional</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}