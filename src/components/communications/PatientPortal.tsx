import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Paperclip, Calendar, FileText, User, Lock } from 'lucide-react';
import { PortalMessage } from '@/types/communications';

const mockPortalMessages: PortalMessage[] = [
  {
    id: '1',
    patientId: 'p1',
    subject: 'Appointment Confirmation Needed',
    content: 'Hi Dr. Smith, I received a reminder about my upcoming appointment on Friday. Can you please confirm the time? Thank you.',
    direction: 'inbound',
    isRead: false,
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    patientId: 'p1',
    subject: 'Re: Appointment Confirmation Needed',
    content: 'Hello John, your appointment is confirmed for Friday at 2:00 PM. Please arrive 15 minutes early for check-in. See you then!',
    direction: 'outbound',
    isRead: true,
    createdAt: '2024-01-15T15:45:00Z',
    readAt: '2024-01-15T16:00:00Z'
  },
  {
    id: '3',
    patientId: 'p2',
    subject: 'Insurance Question',
    content: 'I have a question about my insurance coverage for the upcoming root canal procedure. Can someone help me understand what portion will be covered?',
    direction: 'inbound',
    isRead: false,
    createdAt: '2024-01-14T09:15:00Z'
  }
];

export function PatientPortal() {
  const [selectedTab, setSelectedTab] = useState('messages');
  const [selectedMessage, setSelectedMessage] = useState<PortalMessage | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Portal</h2>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Portal Message</DialogTitle>
            </DialogHeader>
            <PortalMessageForm onClose={() => setIsComposeOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="patient-view">Patient View</TabsTrigger>
          <TabsTrigger value="settings">Portal Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <MessageList 
                messages={mockPortalMessages} 
                selectedMessage={selectedMessage}
                onSelectMessage={setSelectedMessage}
              />
            </div>
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <MessageView message={selectedMessage} />
              ) : (
                <EmptyMessageView />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="patient-view">
          <PatientPortalSimulation />
        </TabsContent>

        <TabsContent value="settings">
          <PortalSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MessageList({ 
  messages, 
  selectedMessage, 
  onSelectMessage 
}: { 
  messages: PortalMessage[];
  selectedMessage: PortalMessage | null;
  onSelectMessage: (message: PortalMessage) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portal Messages</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-1 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id 
                    ? 'bg-primary/10 border-primary border' 
                    : 'hover:bg-muted'
                } ${!message.isRead && message.direction === 'inbound' ? 'bg-blue-50' : ''}`}
                onClick={() => onSelectMessage(message)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.direction === 'inbound' ? 'P' : 'D'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {message.direction === 'inbound' ? 'John Smith' : 'Dr. Smith'}
                      </p>
                      {!message.isRead && message.direction === 'inbound' && (
                        <Badge variant="destructive" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {message.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function MessageView({ message }: { message: PortalMessage }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {message.direction === 'inbound' ? 'P' : 'D'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {message.direction === 'inbound' ? 'John Smith' : 'Dr. Smith'}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <Badge variant={message.direction === 'inbound' ? 'secondary' : 'default'}>
            {message.direction === 'inbound' ? 'From Patient' : 'From Practice'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{message.subject}</h3>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
          </div>
          {message.attachments && message.attachments.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Attachments</h4>
              <div className="space-y-2">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">{attachment.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyMessageView() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No message selected</h3>
          <p className="text-muted-foreground">Select a message from the list to view its content</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PatientPortalSimulation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Portal View (Simulation)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Patient Portal</h2>
              <p className="text-gray-600">Manage your dental health journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium">Messages</h3>
                  <p className="text-sm text-muted-foreground">2 new messages</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium">Appointments</h3>
                  <p className="text-sm text-muted-foreground">Next: Jan 20, 2:00 PM</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium">Treatment Plans</h3>
                  <p className="text-sm text-muted-foreground">1 pending approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-medium">Profile</h3>
                  <p className="text-sm text-muted-foreground">Update information</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg">
              <h3 className="font-medium mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 border-l-4 border-blue-500 bg-blue-50">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">New message from Dr. Smith</span>
                </div>
                <div className="flex items-center gap-3 p-2 border-l-4 border-green-500 bg-green-50">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Appointment confirmed for Jan 20</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PortalSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Portal Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Require 2FA for patient login</p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Session Timeout</h4>
              <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
            </div>
            <select className="rounded border px-3 py-1">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">Notify patients of new messages</p>
            </div>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portal Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Appointment Booking</h4>
              <p className="text-sm text-muted-foreground">Allow patients to book appointments online</p>
            </div>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Treatment Plan Review</h4>
              <p className="text-sm text-muted-foreground">Patients can review and approve treatment plans</p>
            </div>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Payment Portal</h4>
              <p className="text-sm text-muted-foreground">Online payment functionality</p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PortalMessageForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="recipient">Recipient</Label>
        <select className="w-full rounded border px-3 py-2">
          <option>John Smith</option>
          <option>Jane Doe</option>
          <option>Mike Johnson</option>
        </select>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" placeholder="Message subject" />
      </div>

      <div>
        <Label htmlFor="content">Message</Label>
        <Textarea 
          id="content" 
          placeholder="Type your message here..." 
          rows={6}
        />
      </div>

      <div>
        <Label htmlFor="attachment">Attachments (Optional)</Label>
        <Input type="file" id="attachment" multiple />
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