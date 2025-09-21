import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MessageSquare, Users, Target, Mail, Smartphone, Phone, Calendar } from 'lucide-react';
import { CommunicationAnalytics } from '@/types/communications';

const mockAnalytics: CommunicationAnalytics = {
  period: {
    start: '2024-01-01',
    end: '2024-01-31'
  },
  metrics: {
    totalMessages: 2450,
    deliveryRate: 96.5,
    responseRate: 34.2,
    optOutRate: 2.1,
    avgResponseTime: 145
  },
  byChannel: {
    sms: {
      sent: 1200,
      delivered: 1176,
      read: 1058,
      responded: 425,
      cost: 60.00
    },
    email: {
      sent: 800,
      delivered: 760,
      read: 608,
      responded: 243,
      cost: 8.00
    },
    portal: {
      sent: 350,
      delivered: 350,
      read: 280,
      responded: 112,
      cost: 0.00
    },
    phone: {
      sent: 100,
      delivered: 85,
      read: 85,
      responded: 76,
      cost: 15.00
    }
  },
  byCategory: {
    appointment: {
      sent: 980,
      effectiveness: 85.2
    },
    recall: {
      sent: 650,
      effectiveness: 42.1
    },
    general: {
      sent: 520,
      effectiveness: 28.7
    },
    reminder: {
      sent: 220,
      effectiveness: 91.8
    },
    marketing: {
      sent: 80,
      effectiveness: 12.5
    }
  },
  patientEngagement: {
    highEngagement: 245,
    mediumEngagement: 523,
    lowEngagement: 678,
    noResponse: 1004
  }
};

const channelData = [
  { name: 'SMS', sent: 1200, delivered: 1176, responded: 425, color: '#3b82f6' },
  { name: 'Email', sent: 800, delivered: 760, responded: 243, color: '#10b981' },
  { name: 'Portal', sent: 350, delivered: 350, responded: 112, color: '#8b5cf6' },
  { name: 'Phone', sent: 100, delivered: 85, responded: 76, color: '#f59e0b' }
];

const engagementData = [
  { name: 'High Engagement', value: 245, color: '#10b981' },
  { name: 'Medium Engagement', value: 523, color: '#3b82f6' },
  { name: 'Low Engagement', value: 678, color: '#f59e0b' },
  { name: 'No Response', value: 1004, color: '#ef4444' }
];

const dailyTrendData = [
  { day: 'Mon', messages: 85, responses: 29 },
  { day: 'Tue', messages: 92, responses: 35 },
  { day: 'Wed', messages: 78, responses: 28 },
  { day: 'Thu', messages: 105, responses: 41 },
  { day: 'Fri', messages: 95, responses: 33 },
  { day: 'Sat', messages: 45, responses: 12 },
  { day: 'Sun', messages: 30, responses: 8 }
];

const getChannelIcon = (channel: string) => {
  switch (channel.toLowerCase()) {
    case 'sms': return <Smartphone className="h-4 w-4" />;
    case 'email': return <Mail className="h-4 w-4" />;
    case 'phone': return <Phone className="h-4 w-4" />;
    case 'portal': return <MessageSquare className="h-4 w-4" />;
    default: return <MessageSquare className="h-4 w-4" />;
  }
};

export function CommunicationAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Communication Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{mockAnalytics.metrics.totalMessages.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                <p className="text-2xl font-bold">{mockAnalytics.metrics.deliveryRate}%</p>
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
                <p className="text-2xl font-bold">{mockAnalytics.metrics.responseRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Opt-out Rate</p>
                <p className="text-2xl font-bold">{mockAnalytics.metrics.optOutRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{mockAnalytics.metrics.avgResponseTime}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#e5e7eb" name="Sent" />
                <Bar dataKey="delivered" fill="#3b82f6" name="Delivered" />
                <Bar dataKey="responded" fill="#10b981" name="Responded" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Engagement Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {engagementData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Communication Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Communication Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Messages Sent"
                />
                <Line 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Responses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Efficiency & Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockAnalytics.byChannel).map(([channel, data]) => {
                const responseRate = data.sent > 0 ? Math.round((data.responded / data.sent) * 100) : 0;
                const costPerResponse = data.responded > 0 ? (data.cost / data.responded).toFixed(2) : '0.00';
                
                return (
                  <div key={channel} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getChannelIcon(channel)}
                        <span className="font-medium capitalize">{channel}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {responseRate}% response rate
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Sent:</span>
                        <div className="font-semibold">{data.sent}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Delivered:</span>
                        <div className="font-semibold">{data.delivered}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Responded:</span>
                        <div className="font-semibold">{data.responded}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost/Response:</span>
                        <div className="font-semibold">${costPerResponse}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Message Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(mockAnalytics.byCategory).map(([category, data]) => (
              <div key={category} className="text-center p-4 border rounded-lg">
                <h4 className="font-medium capitalize mb-2">{category}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">{data.sent}</div>
                <div className="text-sm text-muted-foreground">Messages Sent</div>
                <div className="text-lg font-semibold text-green-600 mt-2">{data.effectiveness}%</div>
                <div className="text-xs text-muted-foreground">Effectiveness</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}