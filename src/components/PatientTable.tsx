import { Patient, SortField, SortDirection } from '@/types/patient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientTableProps {
  patients: Patient[];
  selectedPatients: string[];
  onSelectPatient: (patientId: string) => void;
  onSelectAll: (selected: boolean) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const statusConfig = {
  active: { className: 'status-active', label: 'Active' },
  inactive: { className: 'status-inactive', label: 'Inactive' },
  pending: { className: 'status-pending', label: 'Pending' },
  discharged: { className: 'status-discharged', label: 'Discharged' }
};

export const PatientTable = ({
  patients,
  selectedPatients,
  onSelectPatient,
  onSelectAll,
  sortField,
  sortDirection,
  onSort
}: PatientTableProps) => {
  const allSelected = patients.length > 0 && selectedPatients.length === patients.length;
  const someSelected = selectedPatients.length > 0 && selectedPatients.length < patients.length;

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="data-table">
      <Table>
        <TableHeader className="table-header">
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-border"
              />
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort('name')}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Name {getSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort('id')}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Patient ID {getSortIcon('id')}
              </Button>
            </TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort('lastVisit')}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Last Visit {getSortIcon('lastVisit')}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort('status')}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Status {getSortIcon('status')}
              </Button>
            </TableHead>
            <TableHead>Primary Physician</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const isSelected = selectedPatients.includes(patient.id);
            const statusInfo = statusConfig[patient.status];
            
            return (
              <TableRow 
                key={patient.id} 
                className={cn(
                  'table-row',
                  isSelected && 'bg-primary/5'
                )}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectPatient(patient.id)}
                    className="rounded border-border"
                  />
                </TableCell>
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
};