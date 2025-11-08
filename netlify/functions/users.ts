import type { Handler } from '@netlify/functions';
import { users } from './db';
import { User } from './types';

const handler: Handler = async (event) => {
    const { httpMethod, body } = event;

    try {
        switch (httpMethod) {
            case 'POST':
                const postData = JSON.parse(body || '{}');
                // Login action
                if (postData.action === 'login') {
                    const { identifier, password } = postData;
                    const user = users.find(
                        u => (u.username === identifier || u.email === identifier || u.sipTalkId === identifier) && u.password === password
                    );
                    if (user) {
                        const { password, ...userToReturn } = user;
                        return { statusCode: 200, body: JSON.stringify(userToReturn) };
                    }
                    return { statusCode: 401, body: JSON.stringify({ message: 'Invalid credentials' }) };
                }
                // Add user action
                const newUser: User = { ...postData, id: Date.now() };
                if (!newUser.password) newUser.password = 'password';
                users.push(newUser);
                const { password: _, ...newUserToReturn } = newUser;
                return { statusCode: 201, body: JSON.stringify(newUserToReturn) };

            case 'GET':
                const usersToReturn = users.map(({ password, ...user }) => user);
                return { statusCode: 200, body: JSON.stringify(usersToReturn) };

            // Fix: Added a block to scope `userIndex` and prevent a redeclaration error.
            case 'PUT': {
                const updatedUser: User = JSON.parse(body || '{}');
                const userIndex = users.findIndex(u => u.id === updatedUser.id);
                if (userIndex !== -1) {
                    // Preserve password if not provided
                    if (!updatedUser.password) {
                        updatedUser.password = users[userIndex].password;
                    }
                    users[userIndex] = updatedUser;
                    const { password, ...userToReturn } = updatedUser;
                    return { statusCode: 200, body: JSON.stringify(userToReturn) };
                }
                return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
            }

            // Fix: Cannot reassign an imported variable. Mutate the array in-place instead.
            // Fix: Added a block to scope `userIndex` and prevent a redeclaration error.
            case 'DELETE': {
                const { id } = JSON.parse(body || '{}');
                const userIndex = users.findIndex(u => u.id === id);
                if (userIndex !== -1) {
                    users.splice(userIndex, 1);
                    return { statusCode: 204, body: '' };
                }
                return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
            }

            default:
                return { statusCode: 405, body: 'Method Not Allowed' };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Server Error', error: error.message }) };
    }
};

export { handler };