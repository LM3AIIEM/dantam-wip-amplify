import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Bell, Settings, Plus, Play, Pause, BarChart3 } from 'lucide-react';
import { ReminderRule, PatientPreferences, CommunicationChannel } from '@/types/communications';

const mockReminderRules: ReminderRule[] = [
  {
    id: '1',
    name: 'Standard Appointment Reminder',
    appointmentType: 'Cleaning',
    triggers: [
      {
        timeOffset: 1440, // 24 hours
        channels: ['sms', 'email'],
        templateId: '1'
      },
      {
        timeOffset: 60, // 1 hour
        channels: ['sms'],
        templateId: '2'
      }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Surgical Procedure Reminder',
    appointmentType: 'Surgery',
    triggers: [
      {
        timeOffset: 2880, // 48 hours
        channels: ['phone', 'email'],
        templateId: '3'
      },
      {
        timeOffset: 1440, // 24 hours
        channels: ['sms'],
        templateId: '4'
      }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockPatientPreferences: PatientPreferences[] = [
  {
    patientId: 'p1',
    preferredChannel: 'sms',
    optedIn: {
      appointments: true,
      recalls: true,
      marketing: false,
      general: true
    },
    phoneNumbers: {
      primary: '(555) 123-4567',
      mobile: '(555) 123-4567'
    },
    email: 'john.smith@email.com',
    timezone: 'America/New_York',
    preferredTime: {
      start: '09:00',
      end: '18:00'
    },
    language: 'English'
  }
];

const getReminderStatus = (rule: ReminderRule) => {
  return rule.isActive ? 'Active' : 'Inactive';
};

const getChannelName = (channel: CommunicationChannel['type']) => {
  switch (channel) {
    case 'sms': return 'SMS';
    case 'email': return 'Email';
    case 'phone': return 'Phone';
    case 'portal': return 'Portal';
    default: return channel;
  }
};

export function ReminderManagement() {
  const [selectedTab, setSelectedTab] = useState('rules');
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reminder Management</h2>
        <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Reminder Rule</DialogTitle>
            </DialogHeader>
            <ReminderRuleForm onClose={() => setIsRuleDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="rules">Reminder Rules</TabsTrigger>
          <TabsTrigger value="preferences">Patient Preferences</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <ReminderRules rules={mockReminderRules} />
        </TabsContent>

        <TabsContent value="preferences">
          <PatientPreferencesManager preferences={mockPatientPreferences} />
        </TabsContent>

        <TabsContent value="analytics">
          <ReminderAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReminderRules({ rules }: { rules: ReminderRule[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminder Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule Name</TableHead>
              <TableHead>Appointment Type</TableHead>
              <TableHead>Triggers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>{rule.appointmentType}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {rule.triggers.map((trigger, index) => (
                      <div key={index} className="text-sm">
                        <Badge variant="outline" className="mr-2">
                          {trigger.timeOffset >= 1440 
                            ? `${trigger.timeOffset / 1440}d` 
                            : `${trigger.timeOffset}m`
                          } before
                        </Badge>
                        {trigger.channels.map((channel) => (
                          <Badge key={channel} variant="secondary" className="mr-1 text-xs">
                            {getChannelName(channel)}
                          </Badge>
                        ))}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                    {getReminderStatus(rule)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={rule.isActive ? 'text-red-600' : 'text-green-600'}
                    >
                      {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PatientPreferencesManager({ preferences }: { preferences: PatientPreferences[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Communication Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Preferred Channel</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Opt-ins</TableHead>
              <TableHead>Preferred Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preferences.map((pref) => (
              <TableRow key={pref.patientId}>
                <TableCell className="font-medium">John Smith</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getChannelName(pref.preferredChannel)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{pref.phoneNumbers.primary}</div>
                    <div className="text-muted-foreground">{pref.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {Object.entries(pref.optedIn).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <Badge 
                          variant={value ? 'default' : 'secondary'} 
                          className="w-20 justify-center text-xs"
                        >
                          {key}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {pref.preferredTime.start} - {pref.preferredTime.end}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ReminderAnalytics() {
  const analyticsData = {
    totalReminders: 1250,
    deliveryRate: 96.5,
    responseRate: 78.2,
    showUpRate: 85.4,
    costPerReminder: 0.08
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Reminders</p>
                <p className="text-2xl font-bold">{analyticsData.totalReminders.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                <p className="text-2xl font-bold">{analyticsData.deliveryRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{analyticsData.responseRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Show-up Rate</p>
                <p className="text-2xl font-bold">{analyticsData.showUpRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Cost Per Reminder</p>
                <p className="text-2xl font-bold">${analyticsData.costPerReminder}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Effectiveness by Channel</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Reminders Sent</TableHead>
                <TableHead>Delivery Rate</TableHead>
                <TableHead>Response Rate</TableHead>
                <TableHead>Show-up Rate</TableHead>
                <TableHead>Avg Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>SMS</TableCell>
                <TableCell>850</TableCell>
                <TableCell>98.2%</TableCell>
                <TableCell>82.1%</TableCell>
                <TableCell>87.5%</TableCell>
                <TableCell>$0.05</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>300</TableCell>
                <TableCell>94.7%</TableCell>
                <TableCell>71.3%</TableCell>
                <TableCell>81.2%</TableCell>
                <TableCell>$0.01</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Phone</TableCell>
                <TableCell>100</TableCell>
                <TableCell>92.0%</TableCell>
                <TableCell>89.1%</TableCell>
                <TableCell>91.8%</TableCell>
                <TableCell>$0.15</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ReminderRuleForm({ onClose }: { onClose: () => void }) {
  const [triggers, setTriggers] = useState([
    { timeOffset: 1440, channels: [], templateId: '' }
  ]);

  const addTrigger = () => {
    setTriggers([...triggers, { timeOffset: 60, channels: [], templateId: '' }]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ruleName">Rule Name</Label>
          <Input id="ruleName" placeholder="e.g., Standard Cleaning Reminder" />
        </div>
        <div>
          <Label htmlFor="appointmentType">Appointment Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="checkup">Checkup</SelectItem>
              <SelectItem value="surgery">Surgery</SelectItem>
              <SelectItem value="consultation">Consultation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <Label>Reminder Triggers</Label>
          <Button onClick={addTrigger} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Trigger
          </Button>
        </div>

        <div className="space-y-4">
          {triggers.map((trigger, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Time Before Appointment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="1440">24 hours</SelectItem>
                        <SelectItem value="2880">48 hours</SelectItem>
                        <SelectItem value="10080">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Channels</Label>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">SMS</Button>
                      <Button variant="outline" size="sm">Email</Button>
                      <Button variant="outline" size="sm">Phone</Button>
                    </div>
                  </div>
                  <div>
                    <Label>Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Appointment Reminder</SelectItem>
                        <SelectItem value="2">Urgent Reminder</SelectItem>
                        <SelectItem value="3">Courtesy Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="active" />
        <Label htmlFor="active">Rule is active</Label>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Create Rule
        </Button>
      </div>
    </div>
  );
}