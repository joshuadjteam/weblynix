import type { Handler } from '@netlify/functions';
import pool from './db-client';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    // In a real app, you'd filter emails for the logged-in user.
    const { rows } = await pool.query('SELECT * FROM mails ORDER BY timestamp DESC');
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Server Error', error: error.message }) };
  }
};

export { handler };
