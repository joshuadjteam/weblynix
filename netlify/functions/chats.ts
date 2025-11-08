import type { Handler } from '@netlify/functions';
import pool from './db-client';
import { Conversation, ChatMessage } from './types';

const handler: Handler = async (event) => {
    const { httpMethod, body, queryStringParameters } = event;

    try {
        switch (httpMethod) {
            case 'GET': {
                const userId = queryStringParameters?.userId ? parseInt(queryStringParameters.userId) : null;
                if (!userId) {
                    return { statusCode: 401, body: JSON.stringify({ message: 'User ID is required' }) };
                }

                const { rows: messages } = await pool.query<ChatMessage & { receiverId: number }>(
                    `SELECT id, "senderId", "receiverId", text, "timestamp" FROM chat_messages 
                     WHERE "senderId" = $1 OR "receiverId" = $1 ORDER BY timestamp ASC`,
                    [userId]
                );

                const conversationsMap = new Map<number, ChatMessage[]>();
                messages.forEach(msg => {
                    const contactId = msg.senderId === userId ? msg.receiverId : msg.senderId;
                    if (!conversationsMap.has(contactId)) {
                        conversationsMap.set(contactId, []);
                    }
                    const { receiverId, ...messageToPush } = msg; // remove receiverId before pushing
                    conversationsMap.get(contactId)?.push(messageToPush);
                });

                const result: Conversation[] = Array.from(conversationsMap.entries()).map(([contactId, messages]) => ({
                    contactId,
                    messages,
                }));

                return { statusCode: 200, body: JSON.stringify(result) };
            }

            case 'POST': {
                const { contactId, message } = JSON.parse(body || '{}');
                if (!contactId || !message || !message.senderId || !message.text || !message.timestamp) {
                    return { statusCode: 400, body: JSON.stringify({ message: 'Invalid message payload' }) };
                }
                
                const receiverId = contactId;
                const { senderId, text, timestamp } = message;

                const { rows } = await pool.query<ChatMessage>(
                    `INSERT INTO chat_messages ("senderId", "receiverId", text, "timestamp")
                     VALUES ($1, $2, $3, $4) RETURNING id, "senderId", text, "timestamp"`,
                    [senderId, receiverId, text, timestamp]
                );
                
                return { statusCode: 201, body: JSON.stringify(rows[0]) };
            }

            default:
                return { statusCode: 405, body: 'Method Not Allowed' };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Server Error', error: error.message }) };
    }
};

export { handler };
