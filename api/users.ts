import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../_lib/db-client';
import { User } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { method, body } = req;

    try {
        await pool.query('SELECT 1'); // test connection
    } catch (e: any) {
        return res.status(500).json({ message: "Database connection failed", error: e.message });
    }

    try {
        switch (method) {
            case 'POST': {
                if (body.action === 'login') {
                    const { identifier, password } = body;
                    const { rows } = await pool.query<User>(
                        `SELECT * FROM users WHERE (username = $1 OR email = $1 OR "sipTalkId" = $1) AND password = $2`,
                        [identifier, password]
                    );
                    const user = rows[0];
                    if (user) {
                        const { password, ...userToReturn } = user;
                        return res.status(200).json(userToReturn);
                    }
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                
                const newUser: Omit<User, 'id'> = body;
                if (!newUser.password) newUser.password = 'password'; // Default password
                const { rows: insertedRows } = await pool.query<User>(
                    `INSERT INTO users (username, email, "sipTalkId", password, role, "billingStatus", features)
                     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                    [newUser.username, newUser.email || null, newUser.sipTalkId || null, newUser.password, newUser.role, newUser.billingStatus, JSON.stringify(newUser.features)]
                );
                const { password, ...newUserToReturn } = insertedRows[0];
                return res.status(201).json(newUserToReturn);
            }

            case 'GET': {
                const { rows } = await pool.query(
                    `SELECT id, username, email, "sipTalkId", role, "billingStatus", features FROM users`
                );
                return res.status(200).json(rows);
            }

            case 'PUT': {
                const updatedUser: User = body;
                // If password is blank, we keep the old one.
                if (!updatedUser.password) {
                     const { rows: existingUserRows } = await pool.query('SELECT password FROM users WHERE id = $1', [updatedUser.id]);
                     if(existingUserRows.length > 0) {
                        updatedUser.password = existingUserRows[0].password;
                     }
                }

                const { rows } = await pool.query<User>(
                    `UPDATE users SET username = $1, email = $2, "sipTalkId" = $3, password = $4, role = $5, "billingStatus" = $6, features = $7
                     WHERE id = $8 RETURNING *`,
                    [updatedUser.username, updatedUser.email || null, updatedUser.sipTalkId || null, updatedUser.password, updatedUser.role, updatedUser.billingStatus, JSON.stringify(updatedUser.features), updatedUser.id]
                );

                if (rows.length > 0) {
                     const { password, ...userToReturn } = rows[0];
                     return res.status(200).json(userToReturn);
                }
                return res.status(404).json({ message: 'User not found' });
            }

            case 'DELETE': {
                const { id } = body;
                const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
                if (result.rowCount > 0) {
                     return res.status(204).end();
                }
                return res.status(404).json({ message: 'User not found' });
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}