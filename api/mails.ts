import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../_lib/db-client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }
  
  try {
    // In a real app, you'd filter emails for the logged-in user.
    const { rows } = await pool.query('SELECT * FROM mails ORDER BY timestamp DESC');
    return res.status(200).json(rows);
  } catch (error: any) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
}