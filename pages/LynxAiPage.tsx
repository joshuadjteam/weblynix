import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { generateText } from '@/services/geminiService';
import { UserRole } from '@/types';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const LynxAiPage: React.FC = () => {
    const { user } = useApp();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isGuestOrAnonymous = !user || user.role === UserRole.GUEST;
    // Mocking response limit for guest
    const [guestResponses, setGuestResponses] = useState(50);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        if(isGuestOrAnonymous && guestResponses <= 0) {
            setMessages(prev => [...prev, { sender: 'user', text: input }, { sender: 'ai', text: 'You have reached your hourly response limit as a guest.' }]);
            setInput('');
            return;
        }

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponseText = await generateText(input);
        
        if(isGuestOrAnonymous) {
            setGuestResponses(prev => prev - 1);
        }

        const aiMessage: Message = { sender: 'ai', text: aiResponseText };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSend();
        }
    };
    
    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto bg-white dark:bg-lynix-dark-blue shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
                <h1 className="text-xl font-bold text-center">LynxAI</h1>
                {isGuestOrAnonymous && <p className="text-xs text-center text-gray-500">Guest Mode | {guestResponses}/50 responses remaining</p>}
                {user && user.role !== UserRole.GUEST && <p className="text-xs text-center text-gray-500">LynxID: {user.username}</p>}
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-xl px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-lynix-blue text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-xs md:max-w-md lg:max-w-xl px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask LynxAI anything..."
                        className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:ring-lynix-blue focus:border-lynix-blue rounded-full transition"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="bg-lynix-blue text-white rounded-full p-3 hover:bg-lynix-blue/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LynxAiPage;