import type { Handler } from '@netlify/functions';
import { conversations } from './db';
import { Conversation } from './types';

const handler: Handler = async (event) => {
    const { httpMethod, body } = event;

    try {
        switch (httpMethod) {
            case 'GET':
                 // In a real app, you would filter conversations for the logged-in user.
                return { statusCode: 200, body: JSON.stringify(conversations) };

            case 'POST':
                const { contactId, message } = JSON.parse(body || '{}');
                const convoIndex = conversations.findIndex(c => c.contactId === contactId);
                
                if (convoIndex > -1) {
                    conversations[convoIndex].messages.push(message);
                } else {
                    const newConversation: Conversation = {
                        contactId: contactId,
                        messages: [message],
                    };
                    conversations.push(newConversation);
                }
                return { statusCode: 201, body: JSON.stringify(message) };

            default:
                return { statusCode: 405, body: 'Method Not Allowed' };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Server Error', error: error.message }) };
    }
};

export { handler };
