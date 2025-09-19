import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Camera, 
  Activity, 
  Calendar,
  User,
  Stethoscope,
  Save,
  Printer,
  Share2
} from 'lucide-react';

import { ToothDiagram } from '@/components/clinical-charting/ToothDiagram';
import { TreatmentPlanBuilder } from '@/components/clinical-charting/TreatmentPlanBuilder';
import { ClinicalNotes } from '@/components/clinical-charting/ClinicalNotes';
import { PhotoManagement } from '@/components/clinical-charting/PhotoManagement';

import { 
  ToothCondition, 
  ToothConditionData, 
  DentalNotation,
  TreatmentPlan,
  TreatmentProcedure,
  ClinicalNote,
  ClinicalAttachment
} from '@/types/clinical-charting';
import { mockPatients } from '@/data/mockPatients';

// Mock data for procedures
const mockProcedures: TreatmentProcedure[] = [
  {
    id: 'proc-1',
    code: 'D2391',
    name: 'Posterior Composite Filling',
    description: 'One surface composite restoration',
    estimatedCost: 3500,
    estimatedDuration: 60,
    requiresAnesthesia: true,
    category: 'Restorative'
  },
  {
    id: 'proc-2',
    code: 'D2750',
    name: 'Crown - Porcelain',
    description: 'Porcelain fused to metal crown',
    estimatedCost: 15000,
    estimatedDuration: 90,
    requiresAnesthesia: true,
    category: 'Restorative'
  },
  {
    id: 'proc-3',
    code: 'D4210',
    name: 'Gingivectomy',
    description: 'Gingivectomy or gingivoplasty - four or more contiguous teeth',
    estimatedCost: 8000,
    estimatedDuration: 75,
    requiresAnesthesia: true,
    category: 'Periodontic'
  },
  {
    id: 'proc-4',
    code: 'D1110',
    name: 'Prophylaxis - Adult',
    description: 'Routine dental cleaning',
    estimatedCost: 2000,
    estimatedDuration: 30,
    requiresAnesthesia: false,
    category: 'Preventive'
  },
  {
    id: 'proc-5',
    code: 'D3310',
    name: 'Root Canal - Anterior',
    description: 'Endodontic treatment, anterior tooth',
    estimatedCost: 12000,
    estimatedDuration: 120,
    requiresAnesthesia: true,
    category: 'Endodontic'
  }
];

export default function ClinicalChartingPage() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId') || '1';
  const patient = mockPatients.find(p => p.id === patientId) || mockPatients[0];

  // State management
  const [chartType, setChartType] = useState<'adult' | 'pediatric'>('adult');
  const [notation, setNotation] = useState<DentalNotation>('fdi');
  const [selectedTooth, setSelectedTooth] = useState<string>('');
  const [toothConditions, setToothConditions] = useState<ToothConditionData[]>([]);
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan>({
    id: 'plan-1',
    patientId: patient.id,
    providerId: 'provider-1',
    createdDate: new Date(),
    updatedDate: new Date(),
    title: `Treatment Plan for ${patient.name}`,
    items: [],
    totalCost: 0,
    estimatedDuration: 0,
    status: 'draft'
  });
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [photos, setPhotos] = useState<ClinicalAttachment[]>([]);

  const handleToothClick = (toothNumber: string) => {
    setSelectedTooth(toothNumber);
  };

  const handleConditionUpdate = (toothNumber: string, condition: ToothCondition) => {
    const existingConditionIndex = toothConditions.findIndex(
      c => c.toothNumber === toothNumber
    );

    if (existingConditionIndex >= 0) {
      const updatedConditions = [...toothConditions];
      updatedConditions[existingConditionIndex] = {
        ...updatedConditions[existingConditionIndex],
        condition,
        dateRecorded: new Date()
      };
      setToothConditions(updatedConditions);
    } else {
      const newCondition: ToothConditionData = {
        toothNumber,
        condition,
        notes: '',
        dateRecorded: new Date(),
        treatedBy: 'Dr. Smith',
        color: '#3b82f6'
      };
      setToothConditions([...toothConditions, newCondition]);
    }
  };

  const handleAddNote = (note: Omit<ClinicalNote, 'id'>) => {
    const newNote: ClinicalNote = {
      ...note,
      id: `note-${Date.now()}`
    };
    setClinicalNotes([...clinicalNotes, newNote]);
  };

  const handleUpdateNote = (id: string, updates: Partial<ClinicalNote>) => {
    setClinicalNotes(notes => 
      notes.map(note => note.id === id ? { ...note, ...updates } : note)
    );
  };

  const handleDeleteNote = (id: string) => {
    setClinicalNotes(notes => notes.filter(note => note.id !== id));
  };

  const handleAddPhoto = (photo: Omit<ClinicalAttachment, 'id'>) => {
    const newPhoto: ClinicalAttachment = {
      ...photo,
      id: `photo-${Date.now()}`
    };
    setPhotos([...photos, newPhoto]);
  };

  const handleUpdatePhoto = (id: string, updates: Partial<ClinicalAttachment>) => {
    setPhotos(currentPhotos => 
      currentPhotos.map(photo => photo.id === id ? { ...photo, ...updates } : photo)
    );
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(currentPhotos => currentPhotos.filter(photo => photo.id !== id));
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-6 p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clinical Charting</h1>
            <p className="text-muted-foreground">
              Advanced dental charting and treatment planning for comprehensive patient care
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Chart
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{patient.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span>Patient ID: {patient.id}</span>
                  <span>DOB: {patient.dateOfBirth}</span>
                  <span>Last Visit: {patient.lastVisit}</span>
                  <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                    {patient.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="chart-type">Chart Type:</Label>
                <Select value={chartType} onValueChange={(value: 'adult' | 'pediatric') => setChartType(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="pediatric">Pediatric</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="notation">Notation:</Label>
                <Select value={notation} onValueChange={(value: DentalNotation) => setNotation(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fdi">FDI</SelectItem>
                    <SelectItem value="universal">Universal</SelectItem>
                    <SelectItem value="palmer">Palmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="charting" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="charting" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Dental Chart
            </TabsTrigger>
            <TabsTrigger value="treatment" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Treatment Plan
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Clinical Notes
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Tooth Diagram */}
              <div className="lg:col-span-3">
                <ToothDiagram
                  type={chartType}
                  notation={notation}
                  conditions={toothConditions}
                  onToothClick={handleToothClick}
                  onConditionUpdate={handleConditionUpdate}
                  selectedTooth={selectedTooth}
                />
              </div>

              {/* Tooth Details Panel */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedTooth ? `Tooth ${selectedTooth}` : 'Select a Tooth'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTooth ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="condition">Condition</Label>
                          <Select 
                            onValueChange={(value: ToothCondition) => 
                              handleConditionUpdate(selectedTooth, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="healthy">Healthy</SelectItem>
                              <SelectItem value="caries">Caries</SelectItem>
                              <SelectItem value="filling">Filling</SelectItem>
                              <SelectItem value="crown">Crown</SelectItem>
                              <SelectItem value="implant">Implant</SelectItem>
                              <SelectItem value="extraction">Extraction</SelectItem>
                              <SelectItem value="root_canal">Root Canal</SelectItem>
                              <SelectItem value="bridge">Bridge</SelectItem>
                              <SelectItem value="veneer">Veneer</SelectItem>
                              <SelectItem value="sealant">Sealant</SelectItem>
                              <SelectItem value="missing">Missing</SelectItem>
                              <SelectItem value="impacted">Impacted</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="notes">Notes</Label>
                          <Input
                            id="notes"
                            placeholder="Clinical notes for this tooth"
                          />
                        </div>
                        <Button className="w-full">
                          Update Condition
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Click on a tooth in the diagram to view and edit its condition.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="treatment">
            <TreatmentPlanBuilder
              treatmentPlan={treatmentPlan}
              onUpdatePlan={setTreatmentPlan}
              availableProcedures={mockProcedures}
              patientName={patient.name}
            />
          </TabsContent>

          <TabsContent value="notes">
            <ClinicalNotes
              notes={clinicalNotes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              patientId={patient.id}
              providerId="provider-1"
              providerName="Dr. Smith"
            />
          </TabsContent>

          <TabsContent value="photos">
            <PhotoManagement
              photos={photos}
              onAddPhoto={handleAddPhoto}
              onUpdatePhoto={handleUpdatePhoto}
              onDeletePhoto={handleDeletePhoto}
              patientName={patient.name}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}