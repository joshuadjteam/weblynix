import type { Handler } from '@netlify/functions';
import { mails } from './db';

// This is a simplified function. A real mail backend would be much more complex.
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // In a real app, you'd filter emails for the logged-in user.
  return {
    statusCode: 200,
    body: JSON.stringify(mails),
  };
};

export { handler };
