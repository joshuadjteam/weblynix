export const generateText = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch('/api/generate-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error from backend:", errorData.error);
            return errorData.error || "An error occurred fetching the AI response.";
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error calling backend for Gemini:", error);
        return "Sorry, I encountered a network error while processing your request.";
    }
};
