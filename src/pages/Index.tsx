import { AppLayout } from '@/components/layout/AppLayout';
import { PatientDirectory } from '@/components/PatientDirectory';

const Index = () => {
  const breadcrumbs = [
    { title: 'Patient Management', href: '/patients' },
    { title: 'Patient Directory', isCurrentPage: true },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PatientDirectory />
    </AppLayout>
  );
};

export default Index;
