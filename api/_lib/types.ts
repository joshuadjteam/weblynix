// This file mirrors the frontend types for consistency in the backend functions.
// In a monorepo setup, this could be a shared package.

export enum UserRole {
  ADMIN = 'Admin',
  STANDARD = 'Standard',
  TRIAL = 'Trial',
  GUEST = 'Guest',
  CUSTOM = 'Custom',
}

export enum BillingStatus {
  ON_TIME = 'On Time',
  OVERDUE = 'Overdue',
  SUSPENDED = 'Suspended',
}

export interface UserFeatures {
  dialer: boolean;
  ai: boolean;
  mail: boolean;
  chat: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string | null;
  sipTalkId: string | null;
  password?: string;
  role: UserRole;
  billingStatus: BillingStatus;
  features: UserFeatures;
}

export interface Note {
  id: number;
  userId: number; // Keep track of which user owns the note
  title: string;
  content: string;
  lastModified: number;
}

export interface Mail {
  id: number;
  from: { name: string; email: string };
  to: string;
  subject: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  text: string;
  timestamp: number;
}

export interface Conversation {
  contactId: number;
  messages: ChatMessage[];
}

export interface Contact {
  id: number;
  userId: number;
  name: string;
  email: string | null;
  phone: string | null;
}