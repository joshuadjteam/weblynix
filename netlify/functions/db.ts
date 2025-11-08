// This is a simple in-memory "database" to simulate persistence for Netlify Functions.
// In a production app, you would replace this with a connection to a real database
// like FaunaDB, Supabase, or MongoDB Atlas.

import { User, UserRole, BillingStatus, Mail, Conversation, Note } from './types';

export let users: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@lynixity.x10.bz',
    sipTalkId: '0470000001',
    password: 'password',
    role: UserRole.ADMIN,
    billingStatus: BillingStatus.ON_TIME,
    features: { dialer: true, ai: true, mail: true, chat: true },
  },
  {
    id: 2,
    username: 'standard_user',
    email: 'standard@example.com',
    sipTalkId: '0470000002',
    password: 'password',
    role: UserRole.STANDARD,
    billingStatus: BillingStatus.ON_TIME,
    features: { dialer: true, ai: true, mail: true, chat: true },
  },
  {
    id: 3,
    username: 'trial_user',
    email: 'trial@example.com',
    sipTalkId: '0470000003',
    password: 'password',
    role: UserRole.TRIAL,
    billingStatus: BillingStatus.ON_TIME,
    features: { dialer: true, ai: false, mail: true, chat: false },
  },
  {
    id: 4,
    username: 'overdue_user',
    email: 'overdue@example.com',
    sipTalkId: '0470000004',
    password: 'password',
    role: UserRole.STANDARD,
    billingStatus: BillingStatus.OVERDUE,
    features: { dialer: true, ai: true, mail: true, chat: true },
  },
  {
    id: 5,
    username: 'suspended_user',
    email: 'suspended@example.com',
    sipTalkId: '0470000005',
    password: 'password',
    role: UserRole.STANDARD,
    billingStatus: BillingStatus.SUSPENDED,
    features: { dialer: false, ai: false, mail: false, chat: false },
  },
  {
    id: 6,
    username: 'custom_user',
    email: 'custom@example.com',
    sipTalkId: '0470000006',
    password: 'password',
    role: UserRole.CUSTOM,
    billingStatus: BillingStatus.ON_TIME,
    features: { dialer: true, ai: true, mail: false, chat: true },
  },
];

export let notes: Note[] = [
    { id: 1, userId: 1, title: 'Welcome Note', content: 'This is your first note stored on the server!', lastModified: Date.now() },
    { id: 2, userId: 2, title: 'Shopping List', content: '- Milk\n- Bread\n- Eggs', lastModified: Date.now() - 100000 },
];

export let mails: Mail[] = [
    {
        id: 1,
        from: { name: 'Lynix Support', email: 'support@lynixity.x10.bz' },
        to: 'admin@lynixity.x10.bz',
        subject: 'Welcome to LocalMail!',
        body: 'Hello and welcome to the new LocalMail feature!\n\nThis is a demonstration of the mail client interface. You can browse, read, and compose messages.\n\nEnjoy exploring!\n\nThe Lynix Team',
        timestamp: Date.now() - 1000 * 60 * 5,
        read: false,
    },
    {
        id: 2,
        from: { name: 'Project Updates', email: 'updates@lynix.dev' },
        to: 'admin@lynixity.x10.bz',
        subject: 'Q3 Project Roadmap',
        body: 'Hi team,\n\nPlease find the attached roadmap for our projects in the third quarter. We have some exciting updates coming up for the Notepad and Dialer apps.\n\nBest,\nManagement',
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
        read: true,
    },
     {
        id: 3,
        from: { name: 'standard_user', email: 'standard@example.com' },
        to: 'admin@lynixity.x10.bz',
        subject: 'Quick question',
        body: 'Hey, I was wondering if we could sync our contacts from the Contacts app with the Dialer app. Let me know what you think. Thanks!',
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        read: true,
    }
];

export let conversations: Conversation[] = [
    {
        contactId: 2, // standard_user
        messages: [
            { id: 1, senderId: 2, text: 'Hey! How is the new chat feature coming along?', timestamp: Date.now() - 1000 * 60 * 10 },
            { id: 2, senderId: 1, text: 'It\'s looking great! We just pushed a new update. You should be able to test it now.', timestamp: Date.now() - 1000 * 60 * 8 },
            { id: 3, senderId: 2, text: 'Awesome, I\'ll check it out. Thanks!', timestamp: Date.now() - 1000 * 60 * 7 },
        ]
    },
    {
        contactId: 3, // trial_user
        messages: [
            { id: 1, senderId: 3, text: 'I\'m having trouble with the trial version of the dialer, can you help?', timestamp: Date.now() - 1000 * 60 * 60 * 5 },
        ]
    }
];
