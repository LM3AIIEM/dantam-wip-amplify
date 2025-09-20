import { Patient } from '@/types/patient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface PatientTableProps {
  patients: Patient[];
  onPatientClick?: (patient: Patient) => void;
}

const statusConfig = {
  active: { className: 'status-active', label: 'Active' },
  inactive: { className: 'status-inactive', label: 'Inactive' },
  pending: { className: 'status-pending', label: 'Pending' },
  discharged: { className: 'status-discharged', label: 'Discharged' }
};

export function PatientTable({ patients, onPatientClick }: PatientTableProps) {
  return (
    <div className="data-table">
      <Table>
        <TableHeader className="table-header">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Patient ID</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Primary Carer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const statusInfo = statusConfig[patient.status];
            
            return (
              <TableRow 
                key={patient.id} 
                className="table-row cursor-pointer" 
                onClick={() => onPatientClick?.(patient)}
              >
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell className="font-mono text-sm">{patient.id}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={cn('text-xs font-medium', statusInfo.className)}>
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>{patient.primaryPhysician}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" className="medical-button-primary">
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}