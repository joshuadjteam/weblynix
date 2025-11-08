import type { Handler } from '@netlify/functions';
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("Gemini API key not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ error: "API Key not configured on the server." }) };
    }
    
    try {
        const { prompt } = JSON.parse(event.body || '{}');
        if (!prompt) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required.' }) };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ text: response.text }),
        };
    } catch (error) {
        console.error("Error in generate-text function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Sorry, I encountered an error while processing your request." }),
        };
    }
};

export { handler };
