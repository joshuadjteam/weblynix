import type { Handler } from '@netlify/functions';
import pool from './db-client';
import { User } from './types';

const handler: Handler = async (event) => {
    const { httpMethod, body } = event;

    try {
        await pool.query('SELECT 1'); // test connection
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ message: "Database connection failed", error: e.message }) };
    }

    try {
        switch (httpMethod) {
            case 'POST': {
                const postData = JSON.parse(body || '{}');
                if (postData.action === 'login') {
                    const { identifier, password } = postData;
                    const { rows } = await pool.query<User>(
                        `SELECT * FROM users WHERE (username = $1 OR email = $1 OR "sipTalkId" = $1) AND password = $2`,
                        [identifier, password]
                    );
                    const user = rows[0];
                    if (user) {
                        const { password, ...userToReturn } = user;
                        return { statusCode: 200, body: JSON.stringify(userToReturn) };
                    }
                    return { statusCode: 401, body: JSON.stringify({ message: 'Invalid credentials' }) };
                }
                
                const newUser: Omit<User, 'id'> = postData;
                if (!newUser.password) newUser.password = 'password'; // Default password
                const { rows: insertedRows } = await pool.query<User>(
                    `INSERT INTO users (username, email, "sipTalkId", password, role, "billingStatus", features)
                     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                    [newUser.username, newUser.email || null, newUser.sipTalkId || null, newUser.password, newUser.role, newUser.billingStatus, JSON.stringify(newUser.features)]
                );
                const { password, ...newUserToReturn } = insertedRows[0];
                return { statusCode: 201, body: JSON.stringify(newUserToReturn) };
            }

            case 'GET': {
                const { rows } = await pool.query(
                    `SELECT id, username, email, "sipTalkId", role, "billingStatus", features FROM users`
                );
                return { statusCode: 200, body: JSON.stringify(rows) };
            }

            case 'PUT': {
                const updatedUser: User = JSON.parse(body || '{}');
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
                     return { statusCode: 200, body: JSON.stringify(userToReturn) };
                }
                return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
            }

            case 'DELETE': {
                const { id } = JSON.parse(body || '{}');
                const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
                if (result.rowCount > 0) {
                     return { statusCode: 204, body: '' };
                }
                return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
            }

            default:
                return { statusCode: 405, body: 'Method Not Allowed' };
        }
    } catch (error) {
        console.error("API Error:", error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Server Error', error: error.message }) };
    }
};

export { handler };