import type { Handler } from '@netlify/functions';
import pool from './db-client';
import { Contact } from './types';

const handler: Handler = async (event) => {
    const { httpMethod, body, queryStringParameters } = event;
    const userId = queryStringParameters?.userId ? parseInt(queryStringParameters.userId) : null;

    if (!userId) {
        return { statusCode: 401, body: JSON.stringify({ message: 'User authentication required' }) };
    }

    try {
        switch (httpMethod) {
            case 'GET': {
                const { rows } = await pool.query<Contact>(
                    'SELECT * FROM contacts WHERE "userId" = $1 ORDER BY name ASC', [userId]
                );
                return { statusCode: 200, body: JSON.stringify(rows) };
            }

            case 'POST': {
                const { name, email, phone } = JSON.parse(body || '{}');
                const { rows } = await pool.query<Contact>(
                    `INSERT INTO contacts ("userId", name, email, phone)
                     VALUES ($1, $2, $3, $4) RETURNING *`,
                    [userId, name, email || null, phone || null]
                );
                return { statusCode: 201, body: JSON.stringify(rows[0]) };
            }

            case 'PUT': {
                const { id, name, email, phone } = JSON.parse(body || '{}');
                const { rows } = await pool.query<Contact>(
                    `UPDATE contacts SET name = $1, email = $2, phone = $3
                     WHERE id = $4 AND "userId" = $5 RETURNING *`,
                    [name, email || null, phone || null, id, userId]
                );
                if (rows.length > 0) {
                    return { statusCode: 200, body: JSON.stringify(rows[0]) };
                }
                return { statusCode: 404, body: JSON.stringify({ message: 'Contact not found or access denied' }) };
            }
            
            case 'DELETE': {
                const { id } = JSON.parse(body || '{}');
                const result = await pool.query('DELETE FROM contacts WHERE id = $1 AND "userId" = $2', [id, userId]);
                if (result.rowCount > 0) {
                    return { statusCode: 204, body: '' };
                }
                return { statusCode: 404, body: JSON.stringify({ message: 'Contact not found or access denied' }) };
            }

            default:
                return { statusCode: 405, body: 'Method Not Allowed' };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Server Error', error: error.message }) };
    }
};

export { handler };
