import { AppLayout } from '@/components/layout/AppLayout';
import Dashboard from './Dashboard';

const DashboardPage = () => {
  const breadcrumbs = [
    { title: 'Dashboard', isCurrentPage: true },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Dashboard />
    </AppLayout>
  );
};

export default DashboardPage;