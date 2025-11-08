import type { Handler } from '@netlify/functions';
import { notes } from './db';
import { Note } from './types';

const handler: Handler = async (event) => {
    const { httpMethod, body, queryStringParameters } = event;

    // In a real app, userId would come from a decoded JWT token for security.
    const userId = queryStringParameters?.userId ? parseInt(queryStringParameters.userId) : null;
    if (!userId) {
        return { statusCode: 401, body: JSON.stringify({ message: 'User authentication required' }) };
    }

    try {
        switch (httpMethod) {
            case 'GET':
                const userNotes = notes.filter(n => n.userId === userId);
                return { statusCode: 200, body: JSON.stringify(userNotes) };

            case 'POST':
                const { title, content } = JSON.parse(body || '{}');
                const newNote: Note = {
                    id: Date.now(),
                    userId,
                    title: title || 'New Note',
                    content: content || '',
                    lastModified: Date.now(),
                };
                notes.push(newNote);
                return { statusCode: 201, body: JSON.stringify(newNote) };

            // Fix: Added a block to scope `noteIndex` and prevent a redeclaration error.
            case 'PUT': {
                const updatedNote: Note = JSON.parse(body || '{}');
                const noteIndex = notes.findIndex(n => n.id === updatedNote.id && n.userId === userId);
                if (noteIndex !== -1) {
                    notes[noteIndex] = { ...notes[noteIndex], ...updatedNote, lastModified: Date.now() };
                    return { statusCode: 200, body: JSON.stringify(notes[noteIndex]) };
                }
                return { statusCode: 404, body: JSON.stringify({ message: 'Note not found or access denied' }) };
            }
            
            // Fix: Cannot reassign an imported variable. Mutate the array in-place instead.
            // Fix: Added a block to scope `noteIndex` and prevent a redeclaration error.
            case 'DELETE': {
                const { id } = JSON.parse(body || '{}');
                const noteIndex = notes.findIndex(n => n.id === id && n.userId === userId);
                if (noteIndex !== -1) {
                    notes.splice(noteIndex, 1);
                    return { statusCode: 204, body: '' };
                }
                return { statusCode: 404, body: JSON.stringify({ message: 'Note not found or access denied' }) };
            }

            default:
                return { statusCode: 405, body: 'Method Not Allowed' };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Server Error', error: error.message }) };
    }
};

export { handler };