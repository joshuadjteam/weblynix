import { User, UserRole, BillingStatus } from './types';

export const GUEST_USER: User = {
    id: 0,
    username: 'guest',
    email: 'guest@lynix',
    sipTalkId: 'N/A',
    role: UserRole.GUEST,
    billingStatus: BillingStatus.ON_TIME,
    features: { dialer: false, ai: true, mail: false, chat: false },
};
