import { SchedulingCalendar } from '@/components/scheduling/SchedulingCalendar';
import { AppLayout } from '@/components/layout/AppLayout';

export default function SchedulingPage() {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Scheduling', isCurrentPage: true }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6">
        <SchedulingCalendar />
      </div>
    </AppLayout>
  );
}