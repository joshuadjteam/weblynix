import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../_lib/db-client';
import { Note } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { method, body, query } = req;
    const userId = query?.userId ? parseInt(query.userId as string) : null;

    if (!userId) {
        return res.status(401).json({ message: 'User authentication required' });
    }

    try {
        switch (method) {
            case 'GET': {
                const { rows } = await pool.query<Note>(
                    'SELECT * FROM notes WHERE "userId" = $1 ORDER BY "lastModified" DESC', [userId]
                );
                return res.status(200).json(rows);
            }

            case 'POST': {
                const { title, content } = body;
                const { rows } = await pool.query<Note>(
                    `INSERT INTO notes ("userId", title, content, "lastModified")
                     VALUES ($1, $2, $3, $4) RETURNING *`,
                    [userId, title || 'New Note', content || '', Date.now()]
                );
                return res.status(201).json(rows[0]);
            }

            case 'PUT': {
                const updatedNote: Note = body;
                const { rows } = await pool.query<Note>(
                    `UPDATE notes SET title = $1, content = $2, "lastModified" = $3
                     WHERE id = $4 AND "userId" = $5 RETURNING *`,
                    [updatedNote.title, updatedNote.content, Date.now(), updatedNote.id, userId]
                );
                if (rows.length > 0) {
                    return res.status(200).json(rows[0]);
                }
                return res.status(404).json({ message: 'Note not found or access denied' });
            }
            
            case 'DELETE': {
                const { id } = body;
                const result = await pool.query('DELETE FROM notes WHERE id = $1 AND "userId" = $2', [id, userId]);
                if (result.rowCount > 0) {
                    return res.status(204).end();
                }
                return res.status(404).json({ message: 'Note not found or access denied' });
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error: any) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}