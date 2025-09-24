import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Clock, 
  Stethoscope, 
  MapPin, 
  Upload,
  Save,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ProviderType } from '@/types/scheduling';

interface AddProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProviderFormData {
  name: string;
  email: string;
  phone: string;
  provider_type: ProviderType;
  specialization: string;
  license_number: string;
}

interface ScheduleData {
  [key: string]: {
    start_time: string;
    end_time: string;
    break_start: string;
    break_end: string;
    is_available: boolean;
  };
}

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const appointmentTypes = [
  'Consultation', 'Cleaning', 'Filling', 'Extraction', 'Root Canal', 'Crown', 'Checkup', 'Emergency'
];

const resources = [
  { id: '1', name: 'Chair 1', type: 'chair' },
  { id: '2', name: 'Chair 2', type: 'chair' },
  { id: '3', name: 'Chair 3', type: 'chair' },
  { id: '4', name: 'Surgery Room', type: 'operatory' },
  { id: '5', name: 'X-Ray Room', type: 'equipment' }
];

export function AddProviderDialog({ open, onOpenChange }: AddProviderDialogProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProviderFormData>({
    name: '',
    email: '',
    phone: '',
    provider_type: 'dentist',
    specialization: '',
    license_number: ''
  });

  const [scheduleData, setScheduleData] = useState<ScheduleData>(
    daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: {
        start_time: '08:00',
        end_time: '17:00',
        break_start: '12:00',
        break_end: '13:00',
        is_available: day !== 'saturday' && day !== 'sunday'
      }
    }), {})
  );

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Create provider
      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          provider_type: formData.provider_type,
          specialization: formData.specialization,
          license_number: formData.license_number,
          is_active: true
        })
        .select()
        .single();

      if (providerError) throw providerError;

      // Create schedule entries
      const scheduleEntries = Object.entries(scheduleData)
        .filter(([_, schedule]) => schedule.is_available)
        .map(([day, schedule]) => ({
          provider_id: provider.id,
          day_of_week: day as any,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          break_start_time: schedule.break_start,
          break_end_time: schedule.break_end,
          is_available: true
        }));

      if (scheduleEntries.length > 0) {
        const { error: scheduleError } = await supabase
          .from('provider_schedules')
          .insert(scheduleEntries);

        if (scheduleError) throw scheduleError;
      }

      toast({
        title: "Success",
        description: "Provider added successfully"
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error adding provider:', error);
      toast({
        title: "Error",
        description: "Failed to add provider",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      provider_type: 'dentist',
      specialization: '',
      license_number: ''
    });
    setSelectedServices([]);
    setSelectedResources([]);
    setActiveTab('basic');
  };

  const updateSchedule = (day: string, field: string, value: string | boolean) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Provider
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Provider Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg">
                        {formData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="h-3 w-3 mr-1" />
                      Upload Photo
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Dr. John Smith"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="provider_type">Provider Type *</Label>
                      <Select
                        value={formData.provider_type}
                        onValueChange={(value: ProviderType) => 
                          setFormData({...formData, provider_type: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dentist">Dentist</SelectItem>
                          <SelectItem value="hygienist">Hygienist</SelectItem>
                          <SelectItem value="specialist">Specialist</SelectItem>
                          <SelectItem value="assistant">Assistant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john.smith@clinic.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        placeholder="Orthodontics, Endodontics, etc."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="license_number">License Number</Label>
                      <Input
                        id="license_number"
                        value={formData.license_number}
                        onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                        placeholder="DDS-12345"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Working Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {daysOfWeek.map(day => (
                    <div key={day} className="grid grid-cols-6 gap-4 items-center">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={scheduleData[day].is_available}
                          onCheckedChange={(checked) => 
                            updateSchedule(day, 'is_available', checked as boolean)
                          }
                        />
                        <Label className="capitalize font-medium">{day}</Label>
                      </div>
                      
                      {scheduleData[day].is_available ? (
                        <>
                          <div>
                            <Label className="text-xs">Start Time</Label>
                            <Input
                              type="time"
                              value={scheduleData[day].start_time}
                              onChange={(e) => updateSchedule(day, 'start_time', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">End Time</Label>
                            <Input
                              type="time"
                              value={scheduleData[day].end_time}
                              onChange={(e) => updateSchedule(day, 'end_time', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Break Start</Label>
                            <Input
                              type="time"
                              value={scheduleData[day].break_start}
                              onChange={(e) => updateSchedule(day, 'break_start', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Break End</Label>
                            <Input
                              type="time"
                              value={scheduleData[day].break_end}
                              onChange={(e) => updateSchedule(day, 'break_end', e.target.value)}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="col-span-4 text-muted-foreground text-sm">
                          Day off
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Services & Procedures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {appointmentTypes.map(service => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedServices.includes(service)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedServices([...selectedServices, service]);
                          } else {
                            setSelectedServices(selectedServices.filter(s => s !== service));
                          }
                        }}
                      />
                      <Label>{service}</Label>
                    </div>
                  ))}
                </div>
                
                {selectedServices.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Selected Services:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedServices.map(service => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resource Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {resources.map(resource => (
                    <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedResources.includes(resource.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedResources([...selectedResources, resource.id]);
                            } else {
                              setSelectedResources(selectedResources.filter(r => r !== resource.id));
                            }
                          }}
                        />
                        <div>
                          <Label className="font-medium">{resource.name}</Label>
                          <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                        </div>
                      </div>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <div className="flex gap-2">
            {activeTab !== 'basic' && (
              <Button
                variant="outline"
                onClick={() => {
                  const tabs = ['basic', 'schedule', 'services', 'resources'];
                  const currentIndex = tabs.indexOf(activeTab);
                  setActiveTab(tabs[currentIndex - 1]);
                }}
              >
                Previous
              </Button>
            )}
            
            {activeTab !== 'resources' ? (
              <Button
                onClick={() => {
                  const tabs = ['basic', 'schedule', 'services', 'resources'];
                  const currentIndex = tabs.indexOf(activeTab);
                  setActiveTab(tabs[currentIndex + 1]);
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.name}
                className="medical-button-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Provider'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}