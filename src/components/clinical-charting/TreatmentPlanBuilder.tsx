import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import {
  TreatmentPlan,
  TreatmentPlanItem,
  TreatmentProcedure,
  TreatmentPriority,
  TreatmentPhase,
  PRIORITY_COLORS
} from '@/types/clinical-charting';

interface TreatmentPlanBuilderProps {
  treatmentPlan: TreatmentPlan;
  onUpdatePlan: (plan: TreatmentPlan) => void;
  availableProcedures: TreatmentProcedure[];
  patientName: string;
}

export function TreatmentPlanBuilder({
  treatmentPlan,
  onUpdatePlan,
  availableProcedures,
  patientName
}: TreatmentPlanBuilderProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<TreatmentPlanItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<TreatmentPlanItem>>({
    priority: 'recommended',
    phase: 'phase_1',
    status: 'planned'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getPriorityIcon = (priority: TreatmentPriority) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: TreatmentPriority) => {
    return PRIORITY_COLORS[priority];
  };

  const addTreatmentItem = () => {
    if (!newItem.procedure) return;

    const item: TreatmentPlanItem = {
      id: `item-${Date.now()}`,
      toothNumber: newItem.toothNumber,
      procedure: newItem.procedure,
      priority: newItem.priority as TreatmentPriority,
      phase: newItem.phase as TreatmentPhase,
      estimatedCost: newItem.estimatedCost || newItem.procedure.estimatedCost,
      notes: newItem.notes,
      status: 'planned'
    };

    const updatedPlan = {
      ...treatmentPlan,
      items: [...treatmentPlan.items, item],
      totalCost: treatmentPlan.totalCost + item.estimatedCost,
      updatedDate: new Date()
    };

    onUpdatePlan(updatedPlan);
    setIsAddingItem(false);
    setNewItem({ priority: 'recommended', phase: 'phase_1', status: 'planned' });
  };

  const updateTreatmentItem = (itemId: string, updates: Partial<TreatmentPlanItem>) => {
    const updatedItems = treatmentPlan.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    const totalCost = updatedItems.reduce((sum, item) => sum + item.estimatedCost, 0);

    const updatedPlan = {
      ...treatmentPlan,
      items: updatedItems,
      totalCost,
      updatedDate: new Date()
    };

    onUpdatePlan(updatedPlan);
  };

  const deleteTreatmentItem = (itemId: string) => {
    const updatedItems = treatmentPlan.items.filter(item => item.id !== itemId);
    const totalCost = updatedItems.reduce((sum, item) => sum + item.estimatedCost, 0);

    const updatedPlan = {
      ...treatmentPlan,
      items: updatedItems,
      totalCost,
      updatedDate: new Date()
    };

    onUpdatePlan(updatedPlan);
  };

  const groupedItems = treatmentPlan.items.reduce((acc, item) => {
    if (!acc[item.phase]) acc[item.phase] = [];
    acc[item.phase].push(item);
    return acc;
  }, {} as Record<TreatmentPhase, TreatmentPlanItem[]>);

  return (
    <div className="space-y-6">
      {/* Treatment Plan Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Treatment Plan</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Patient: {patientName} | Created: {treatmentPlan.createdDate.toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(treatmentPlan.totalCost)}
              </div>
              <Badge 
                variant="outline" 
                className="mt-1"
                style={{ 
                  borderColor: treatmentPlan.status === 'accepted' ? '#10b981' : '#f59e0b',
                  color: treatmentPlan.status === 'accepted' ? '#10b981' : '#f59e0b'
                }}
              >
                {treatmentPlan.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{treatmentPlan.items.length} Procedures</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{treatmentPlan.estimatedDuration} weeks</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Last updated: {treatmentPlan.updatedDate.toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Treatment Item */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Treatment Items</CardTitle>
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Procedure
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Treatment Procedure</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="tooth-number">Tooth Number (Optional)</Label>
                    <Input
                      id="tooth-number"
                      placeholder="e.g., 14, 21"
                      value={newItem.toothNumber || ''}
                      onChange={(e) => setNewItem({ ...newItem, toothNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="procedure">Procedure</Label>
                    <Select
                      value={newItem.procedure?.id || ''}
                      onValueChange={(value) => {
                        const procedure = availableProcedures.find(p => p.id === value);
                        setNewItem({ ...newItem, procedure });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select procedure" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProcedures.map(procedure => (
                          <SelectItem key={procedure.id} value={procedure.id}>
                            <div>
                              <div className="font-medium">{procedure.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatCurrency(procedure.estimatedCost)} • {procedure.estimatedDuration}min
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newItem.priority}
                      onValueChange={(value: TreatmentPriority) => setNewItem({ ...newItem, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="optional">Optional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phase">Treatment Phase</Label>
                    <Select
                      value={newItem.phase}
                      onValueChange={(value: TreatmentPhase) => setNewItem({ ...newItem, phase: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phase_1">Phase 1</SelectItem>
                        <SelectItem value="phase_2">Phase 2</SelectItem>
                        <SelectItem value="phase_3">Phase 3</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Estimated Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="Enter cost"
                      value={newItem.estimatedCost || newItem.procedure?.estimatedCost || ''}
                      onChange={(e) => setNewItem({ ...newItem, estimatedCost: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes or instructions"
                      value={newItem.notes || ''}
                      onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addTreatmentItem}>
                    Add Procedure
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Treatment Items by Phase */}
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No treatment procedures added yet.</p>
              <p className="text-sm">Click "Add Procedure" to start building the treatment plan.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([phase, items]) => (
                <div key={phase}>
                  <h4 className="font-medium text-lg mb-3 capitalize">
                    {phase.replace('_', ' ')}
                  </h4>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge 
                                variant="outline"
                                style={{ 
                                  borderColor: getPriorityColor(item.priority),
                                  color: getPriorityColor(item.priority)
                                }}
                              >
                                {getPriorityIcon(item.priority)}
                                <span className="ml-1 capitalize">{item.priority}</span>
                              </Badge>
                              {item.toothNumber && (
                                <Badge variant="secondary">
                                  Tooth {item.toothNumber}
                                </Badge>
                              )}
                              <Badge variant="outline" className={
                                item.status === 'completed' ? 'border-green-500 text-green-700' :
                                item.status === 'in_progress' ? 'border-blue-500 text-blue-700' :
                                'border-gray-500 text-gray-700'
                              }>
                                {item.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <h5 className="font-medium">{item.procedure.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {item.procedure.description}
                            </p>
                            {item.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Note: {item.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-medium text-lg">
                              {formatCurrency(item.estimatedCost)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.procedure.estimatedDuration} min
                            </div>
                            <div className="flex gap-1 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingItem(item)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteTreatmentItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}