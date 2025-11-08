import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../_lib/db-client';
import { Conversation, ChatMessage } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { method, body, query } = req;

    try {
        switch (method) {
            case 'GET': {
                const userId = query?.userId ? parseInt(query.userId as string) : null;
                if (!userId) {
                    return res.status(401).json({ message: 'User ID is required' });
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

                return res.status(200).json(result);
            }

            case 'POST': {
                const { contactId, message } = body;
                if (!contactId || !message || !message.senderId || !message.text || !message.timestamp) {
                    return res.status(400).json({ message: 'Invalid message payload' });
                }
                
                const receiverId = contactId;
                const { senderId, text, timestamp } = message;

                const { rows } = await pool.query<ChatMessage>(
                    `INSERT INTO chat_messages ("senderId", "receiverId", text, "timestamp")
                     VALUES ($1, $2, $3, $4) RETURNING id, "senderId", text, "timestamp"`,
                    [senderId, receiverId, text, timestamp]
                );
                
                return res.status(201).json(rows[0]);
            }

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error: any) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}