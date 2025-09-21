import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, Target, TrendingUp, Play, Pause, Edit, Plus } from 'lucide-react';
import { RecallCampaign } from '@/types/communications';

const mockCampaigns: RecallCampaign[] = [
  {
    id: '1',
    name: '6-Month Cleaning Recall',
    description: 'Automated recall for routine dental cleanings',
    treatmentType: 'Cleaning',
    recallInterval: 6,
    targetPatients: ['p1', 'p2', 'p3'],
    message: {
      templateId: '1',
      channel: 'sms'
    },
    status: 'active',
    startDate: '2024-01-01',
    stats: {
      totalTargeted: 150,
      messagesSent: 120,
      responses: 45,
      appointmentsBooked: 32
    },
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Annual Exam Recall',
    description: 'Yearly comprehensive dental examination recall',
    treatmentType: 'Comprehensive Exam',
    recallInterval: 12,
    targetPatients: ['p4', 'p5'],
    message: {
      templateId: '2',
      channel: 'email'
    },
    status: 'draft',
    startDate: '2024-02-01',
    stats: {
      totalTargeted: 200,
      messagesSent: 0,
      responses: 0,
      appointmentsBooked: 0
    },
    createdAt: '2024-01-15T00:00:00Z'
  }
];

const getStatusColor = (status: RecallCampaign['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'paused': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const calculateResponseRate = (campaign: RecallCampaign) => {
  if (campaign.stats.messagesSent === 0) return 0;
  return Math.round((campaign.stats.responses / campaign.stats.messagesSent) * 100);
};

const calculateConversionRate = (campaign: RecallCampaign) => {
  if (campaign.stats.responses === 0) return 0;
  return Math.round((campaign.stats.appointmentsBooked / campaign.stats.responses) * 100);
};

export function RecallCampaigns() {
  const [selectedTab, setSelectedTab] = useState('campaigns');
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recall Campaign Management</h2>
        <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Recall Campaign</DialogTitle>
            </DialogHeader>
            <CampaignForm onClose={() => setIsCampaignDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="patients">Patient Lists</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <CampaignList campaigns={mockCampaigns} />
        </TabsContent>

        <TabsContent value="analytics">
          <CampaignAnalytics campaigns={mockCampaigns} />
        </TabsContent>

        <TabsContent value="patients">
          <PatientRecallLists />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CampaignList({ campaigns }: { campaigns: RecallCampaign[] }) {
  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{campaign.description}</p>
              </div>
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{campaign.stats.totalTargeted}</div>
                <div className="text-sm text-muted-foreground">Total Targeted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{campaign.stats.messagesSent}</div>
                <div className="text-sm text-muted-foreground">Messages Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{campaign.stats.responses}</div>
                <div className="text-sm text-muted-foreground">Responses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{campaign.stats.appointmentsBooked}</div>
                <div className="text-sm text-muted-foreground">Appointments</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Rate</span>
                  <span>{calculateResponseRate(campaign)}%</span>
                </div>
                <Progress value={calculateResponseRate(campaign)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Conversion Rate</span>
                  <span>{calculateConversionRate(campaign)}%</span>
                </div>
                <Progress value={calculateConversionRate(campaign)} className="h-2" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>Treatment: {campaign.treatmentType}</span>
                <span>•</span>
                <span>Interval: {campaign.recallInterval} months</span>
                <span>•</span>
                <span>Channel: {campaign.message.channel.toUpperCase()}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={campaign.status === 'active' ? 'text-red-600' : 'text-green-600'}
                >
                  {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CampaignAnalytics({ campaigns }: { campaigns: RecallCampaign[] }) {
  const totalStats = campaigns.reduce(
    (acc, campaign) => ({
      totalTargeted: acc.totalTargeted + campaign.stats.totalTargeted,
      messagesSent: acc.messagesSent + campaign.stats.messagesSent,
      responses: acc.responses + campaign.stats.responses,
      appointmentsBooked: acc.appointmentsBooked + campaign.stats.appointmentsBooked
    }),
    { totalTargeted: 0, messagesSent: 0, responses: 0, appointmentsBooked: 0 }
  );

  const overallResponseRate = totalStats.messagesSent > 0 
    ? Math.round((totalStats.responses / totalStats.messagesSent) * 100) 
    : 0;
  
  const overallConversionRate = totalStats.responses > 0 
    ? Math.round((totalStats.appointmentsBooked / totalStats.responses) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Targeted</p>
                <p className="text-2xl font-bold">{totalStats.totalTargeted.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Messages Sent</p>
                <p className="text-2xl font-bold">{totalStats.messagesSent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{overallResponseRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{overallConversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Treatment Type</TableHead>
                <TableHead>Messages Sent</TableHead>
                <TableHead>Response Rate</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.treatmentType}</TableCell>
                  <TableCell>{campaign.stats.messagesSent}</TableCell>
                  <TableCell>{calculateResponseRate(campaign)}%</TableCell>
                  <TableCell>{calculateConversionRate(campaign)}%</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      ${(campaign.stats.appointmentsBooked * 150).toLocaleString()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function PatientRecallLists() {
  const recallLists = [
    {
      treatmentType: 'Cleaning',
      dueThisMonth: 45,
      overdue: 12,
      scheduled: 28
    },
    {
      treatmentType: 'Comprehensive Exam',
      dueThisMonth: 23,
      overdue: 8,
      scheduled: 15
    },
    {
      treatmentType: 'Periodontal Maintenance',
      dueThisMonth: 18,
      overdue: 5,
      scheduled: 10
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Recall Lists</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Treatment Type</TableHead>
                <TableHead>Due This Month</TableHead>
                <TableHead>Overdue</TableHead>
                <TableHead>Already Scheduled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recallLists.map((list, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{list.treatmentType}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{list.dueThisMonth}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">{list.overdue}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{list.scheduled}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View List
                      </Button>
                      <Button variant="outline" size="sm">
                        Send Recalls
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CampaignForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="campaignName">Campaign Name</Label>
          <Input id="campaignName" placeholder="e.g., 6-Month Cleaning Recall" />
        </div>
        <div>
          <Label htmlFor="treatmentType">Treatment Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select treatment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="exam">Comprehensive Exam</SelectItem>
              <SelectItem value="periodontal">Periodontal Maintenance</SelectItem>
              <SelectItem value="crown">Crown Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Campaign description..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="recallInterval">Recall Interval (months)</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="channel">Communication Channel</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="portal">Patient Portal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="template">Message Template</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Standard Recall</SelectItem>
            <SelectItem value="2">Friendly Reminder</SelectItem>
            <SelectItem value="3">Urgent Recall</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input type="date" id="startDate" />
        </div>
        <div>
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input type="date" id="endDate" />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Create Campaign
        </Button>
      </div>
    </div>
  );
}