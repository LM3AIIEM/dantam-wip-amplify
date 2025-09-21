export interface CommunicationChannel {
  id: string;
  name: string;
  type: 'sms' | 'email' | 'portal' | 'phone';
  isActive: boolean;
  deliveryRate: number;
  cost: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  channel: CommunicationChannel['type'];
  category: 'appointment' | 'recall' | 'general' | 'reminder' | 'marketing';
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientMessage {
  id: string;
  patientId: string;
  patientName: string;
  channel: CommunicationChannel['type'];
  direction: 'inbound' | 'outbound';
  subject?: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed' | 'responded';
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  scheduledFor?: string;
  templateId?: string;
  campaignId?: string;
  metadata?: Record<string, any>;
}

export interface ReminderRule {
  id: string;
  name: string;
  appointmentType: string;
  triggers: {
    timeOffset: number; // minutes before appointment
    channels: CommunicationChannel['type'][];
    templateId: string;
  }[];
  isActive: boolean;
  createdAt: string;
}

export interface RecallCampaign {
  id: string;
  name: string;
  description: string;
  treatmentType: string;
  recallInterval: number; // months
  targetPatients: string[];
  message: {
    templateId: string;
    channel: CommunicationChannel['type'];
  };
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  stats: {
    totalTargeted: number;
    messagesSent: number;
    responses: number;
    appointmentsBooked: number;
  };
  createdAt: string;
}

export interface PatientPreferences {
  patientId: string;
  preferredChannel: CommunicationChannel['type'];
  optedIn: {
    appointments: boolean;
    recalls: boolean;
    marketing: boolean;
    general: boolean;
  };
  phoneNumbers: {
    primary: string;
    mobile?: string;
  };
  email: string;
  timezone: string;
  preferredTime: {
    start: string; // HH:MM
    end: string;   // HH:MM
  };
  language: string;
}

export interface CommunicationAnalytics {
  period: {
    start: string;
    end: string;
  };
  metrics: {
    totalMessages: number;
    deliveryRate: number;
    responseRate: number;
    optOutRate: number;
    avgResponseTime: number; // minutes
  };
  byChannel: Record<CommunicationChannel['type'], {
    sent: number;
    delivered: number;
    read: number;
    responded: number;
    cost: number;
  }>;
  byCategory: Record<MessageTemplate['category'], {
    sent: number;
    effectiveness: number;
  }>;
  patientEngagement: {
    highEngagement: number;
    mediumEngagement: number;
    lowEngagement: number;
    noResponse: number;
  };
}

export interface PortalMessage {
  id: string;
  patientId: string;
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}