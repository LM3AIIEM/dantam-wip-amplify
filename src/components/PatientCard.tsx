import { Patient } from '@/types/patient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Calendar, FileText, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

const statusConfig = {
  active: { className: 'status-active', label: 'Active' },
  inactive: { className: 'status-inactive', label: 'Inactive' },
  pending: { className: 'status-pending', label: 'Pending' },
  discharged: { className: 'status-discharged', label: 'Discharged' }
};

export function PatientCard({ patient, onClick }: PatientCardProps) {
  const statusInfo = statusConfig[patient.status];

  return (
    <Card className="patient-card hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground text-lg">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
          </div>
          <Badge className={cn('text-xs font-medium', statusInfo.className)}>
            {statusInfo.label}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{patient.phone}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{patient.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{patient.primaryPhysician}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>MRN: {patient.medicalRecordNumber}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span>{patient.insurance}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button size="sm" className="medical-button-primary flex-1">
              View Profile
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}