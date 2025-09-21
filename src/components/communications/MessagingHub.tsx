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
import { MessageSquare, Mail, Phone, Smartphone, Send, Search, Filter, Plus } from 'lucide-react';
import { PatientMessage, MessageTemplate, CommunicationChannel } from '@/types/communications';

const mockChannels: CommunicationChannel[] = [
  { id: '1', name: 'SMS', type: 'sms', isActive: true, deliveryRate: 98, cost: 0.05 },
  { id: '2', name: 'Email', type: 'email', isActive: true, deliveryRate: 95, cost: 0.01 },
  { id: '3', name: 'Portal', type: 'portal', isActive: true, deliveryRate: 90, cost: 0.00 },
  { id: '4', name: 'Phone', type: 'phone', isActive: true, deliveryRate: 85, cost: 0.15 },
];

const mockMessages: PatientMessage[] = [
  {
    id: '1',
    patientId: 'p1',
    patientName: 'John Smith',
    channel: 'sms',
    direction: 'outbound',
    content: 'Reminder: Your appointment is tomorrow at 2:00 PM',
    status: 'delivered',
    sentAt: '2024-01-15T10:00:00Z',
    deliveredAt: '2024-01-15T10:01:00Z'
  },
  {
    id: '2',
    patientId: 'p2',
    patientName: 'Jane Doe',
    channel: 'email',
    direction: 'outbound',
    subject: 'Cleaning Reminder',
    content: 'Its time for your 6-month cleaning appointment!',
    status: 'read',
    sentAt: '2024-01-14T09:00:00Z',
    readAt: '2024-01-14T09:30:00Z'
  }
];

const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Appointment Reminder',
    subject: 'Appointment Reminder',
    content: 'Hi {{patient_name}}, your appointment is scheduled for {{appointment_date}} at {{appointment_time}}.',
    channel: 'sms',
    category: 'reminder',
    variables: ['patient_name', 'appointment_date', 'appointment_time'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const getChannelIcon = (type: CommunicationChannel['type']) => {
  switch (type) {
    case 'sms': return <Smartphone className="h-4 w-4" />;
    case 'email': return <Mail className="h-4 w-4" />;
    case 'phone': return <Phone className="h-4 w-4" />;
    case 'portal': return <MessageSquare className="h-4 w-4" />;
    default: return <MessageSquare className="h-4 w-4" />;
  }
};

const getStatusColor = (status: PatientMessage['status']) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'read': return 'bg-blue-100 text-blue-800';
    case 'sent': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'scheduled': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function MessagingHub() {
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messaging Hub</h2>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Compose Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose New Message</DialogTitle>
            </DialogHeader>
            <ComposeMessageForm onClose={() => setIsComposeOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <MessageInbox messages={mockMessages.filter(m => m.direction === 'inbound')} />
        </TabsContent>

        <TabsContent value="sent">
          <MessageInbox messages={mockMessages.filter(m => m.direction === 'outbound')} />
        </TabsContent>

        <TabsContent value="scheduled">
          <MessageInbox messages={mockMessages.filter(m => m.status === 'scheduled')} />
        </TabsContent>

        <TabsContent value="templates">
          <MessageTemplates templates={mockTemplates} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MessageInbox({ messages }: { messages: PatientMessage[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Messages</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9 w-64" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Subject/Content</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium">{message.patientName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getChannelIcon(message.channel)}
                    <span className="capitalize">{message.channel}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {message.subject && (
                      <div className="font-medium">{message.subject}</div>
                    )}
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {message.content}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(message.status)}>
                    {message.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {message.sentAt && new Date(message.sentAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View
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

function MessageTemplates({ templates }: { templates: MessageTemplate[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Message Templates</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Message Template</DialogTitle>
            </DialogHeader>
            <TemplateForm onClose={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {getChannelIcon(template.channel)}
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <Badge variant={template.isActive ? 'default' : 'secondary'}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {template.subject && (
                  <div>
                    <span className="text-sm font-medium">Subject:</span>
                    <p className="text-sm text-muted-foreground">{template.subject}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium">Content:</span>
                  <p className="text-sm text-muted-foreground truncate">{template.content}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Variables:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Use
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ComposeMessageForm({ onClose }: { onClose: () => void }) {
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="recipient">Recipient</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p1">John Smith</SelectItem>
              <SelectItem value="p2">Jane Doe</SelectItem>
              <SelectItem value="p3">Mike Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="channel">Channel</Label>
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="portal">Portal Message</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="template">Template (Optional)</Label>
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger>
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Appointment Reminder</SelectItem>
            <SelectItem value="2">Recall Notice</SelectItem>
            <SelectItem value="3">General Follow-up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(selectedChannel === 'email' || selectedChannel === 'portal') && (
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="Message subject" />
        </div>
      )}

      <div>
        <Label htmlFor="content">Message Content</Label>
        <Textarea 
          id="content" 
          placeholder="Type your message here..." 
          rows={6}
        />
      </div>

      <div>
        <Label htmlFor="schedule">Schedule Message (Optional)</Label>
        <Input type="datetime-local" id="schedule" />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Send Message
        </Button>
      </div>
    </div>
  );
}

function TemplateForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="templateName">Template Name</Label>
          <Input id="templateName" placeholder="Template name" />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="recall">Recall</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="channel">Channel</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="portal">Portal Message</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject">Subject (Email/Portal only)</Label>
        <Input id="subject" placeholder="Subject line" />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea 
          id="content" 
          placeholder="Use {{variable_name}} for dynamic content" 
          rows={6}
        />
      </div>

      <div>
        <Label>Available Variables</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['patient_name', 'appointment_date', 'appointment_time', 'provider_name'].map((variable) => (
            <Badge key={variable} variant="outline" className="text-xs">
              {variable}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Save Template
        </Button>
      </div>
    </div>
  );
}