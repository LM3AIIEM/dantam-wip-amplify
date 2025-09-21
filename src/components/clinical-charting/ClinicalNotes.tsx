import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Plus,
  Calendar as CalendarIcon,
  FileText,
  AlertTriangle,
  Stethoscope,
  UserCheck,
  Activity,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { ClinicalNote } from '@/types/clinical-charting';

interface ClinicalNotesProps {
  notes: ClinicalNote[];
  onAddNote: (note: Omit<ClinicalNote, 'id'>) => void;
  onUpdateNote: (id: string, note: Partial<ClinicalNote>) => void;
  onDeleteNote: (id: string) => void;
  patientId: string;
  providerId: string;
  providerName: string;
}

export function ClinicalNotes({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  patientId,
  providerId,
  providerName
}: ClinicalNotesProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState<Partial<ClinicalNote>>({
    type: 'examination',
    date: new Date()
  });

  const getNoteTypeIcon = (type: ClinicalNote['type']) => {
    switch (type) {
      case 'examination':
        return <Stethoscope className="h-4 w-4" />;
      case 'treatment':
        return <Activity className="h-4 w-4" />;
      case 'consultation':
        return <UserCheck className="h-4 w-4" />;
      case 'follow_up':
        return <CalendarIcon className="h-4 w-4" />;
      case 'emergency':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getNoteTypeColor = (type: ClinicalNote['type']) => {
    switch (type) {
      case 'examination':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'treatment':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'consultation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'follow_up':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddNote = () => {
    if (!newNote.clinicalFindings || !newNote.diagnosis) return;

    const noteToAdd: Omit<ClinicalNote, 'id'> = {
      patientId,
      providerId,
      date: newNote.date || new Date(),
      type: newNote.type as ClinicalNote['type'],
      chiefComplaint: newNote.chiefComplaint,
      clinicalFindings: newNote.clinicalFindings!,
      diagnosis: newNote.diagnosis!,
      treatmentProvided: newNote.treatmentProvided,
      recommendations: newNote.recommendations,
      nextAppointment: newNote.nextAppointment,
      attachments: []
    };

    onAddNote(noteToAdd);
    setIsAddingNote(false);
    setNewNote({ type: 'examination', date: new Date() });
  };

  const sortedNotes = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Clinical Notes</h3>
          <p className="text-sm text-muted-foreground">
            Document clinical findings, treatments, and follow-up plans
          </p>
        </div>
        <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Clinical Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Clinical Note</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="note-type">Note Type</Label>
                <Select
                  value={newNote.type}
                  onValueChange={(value: ClinicalNote['type']) => setNewNote({ ...newNote, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="examination">Examination</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newNote.date ? format(newNote.date, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newNote.date}
                      onSelect={(date) => setNewNote({ ...newNote, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="chief-complaint">Chief Complaint</Label>
                <Textarea
                  id="chief-complaint"
                  placeholder="Patient's primary concern or reason for visit"
                  value={newNote.chiefComplaint || ''}
                  onChange={(e) => setNewNote({ ...newNote, chiefComplaint: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="clinical-findings">Clinical Findings *</Label>
                <Textarea
                  id="clinical-findings"
                  placeholder="Detailed clinical observations, examination results, and findings"
                  value={newNote.clinicalFindings || ''}
                  onChange={(e) => setNewNote({ ...newNote, clinicalFindings: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="diagnosis">Diagnosis *</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Clinical diagnosis and assessment"
                  value={newNote.diagnosis || ''}
                  onChange={(e) => setNewNote({ ...newNote, diagnosis: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="treatment-provided">Treatment Provided</Label>
                <Textarea
                  id="treatment-provided"
                  placeholder="Treatments, procedures, or interventions performed"
                  value={newNote.treatmentProvided || ''}
                  onChange={(e) => setNewNote({ ...newNote, treatmentProvided: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="recommendations">Recommendations</Label>
                <Textarea
                  id="recommendations"
                  placeholder="Treatment recommendations, home care instructions, etc."
                  value={newNote.recommendations || ''}
                  onChange={(e) => setNewNote({ ...newNote, recommendations: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next-appointment">Next Appointment</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newNote.nextAppointment ? format(newNote.nextAppointment, 'PPP') : 'Select date (optional)'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newNote.nextAppointment}
                      onSelect={(date) => setNewNote({ ...newNote, nextAppointment: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>
                Add Note
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Clinical Notes List */}
      <div className="space-y-4">
        {sortedNotes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">No Clinical Notes</h4>
              <p className="text-muted-foreground text-center mb-4">
                Start documenting clinical findings and treatments for this patient.
              </p>
              <Button onClick={() => setIsAddingNote(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getNoteTypeColor(note.type)}>
                      {getNoteTypeIcon(note.type)}
                      <span className="ml-1 capitalize">{note.type.replace('_', ' ')}</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(note.date, 'PPP')}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDeleteNote(note.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {note.chiefComplaint && (
                  <div>
                    <h5 className="font-medium text-sm mb-1">Chief Complaint</h5>
                    <p className="text-sm text-muted-foreground">{note.chiefComplaint}</p>
                  </div>
                )}
                <div>
                  <h5 className="font-medium text-sm mb-1">Clinical Findings</h5>
                  <p className="text-sm">{note.clinicalFindings}</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Diagnosis</h5>
                  <p className="text-sm">{note.diagnosis}</p>
                </div>
                {note.treatmentProvided && (
                  <div>
                    <h5 className="font-medium text-sm mb-1">Treatment Provided</h5>
                    <p className="text-sm">{note.treatmentProvided}</p>
                  </div>
                )}
                {note.recommendations && (
                  <div>
                    <h5 className="font-medium text-sm mb-1">Recommendations</h5>
                    <p className="text-sm">{note.recommendations}</p>
                  </div>
                )}
                {note.nextAppointment && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Next appointment: {format(note.nextAppointment, 'PPP')}
                    </span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Documented by: {providerName}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}