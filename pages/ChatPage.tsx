import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Conversation, ChatMessage } from '../types';
import { SendIcon } from '../components/icons/Icons';

const ChatPage: React.FC = () => {
    const { user, users } = useApp();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeContactId, setActiveContactId] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/chats');
                if (response.ok) {
                    const data = await response.json();
                    setConversations(data);
                    // Set active contact if not already set
                    if (!activeContactId && data.length > 0) {
                        const chatUsers = users.filter(u => u.id !== user?.id && u.features.chat);
                        if(chatUsers.length > 0) setActiveContactId(chatUsers[0].id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if(users.length > 0) fetchConversations();
    }, [users]);

    const activeConversation = conversations.find(c => c.contactId === activeContactId);
    const activeContact = users.find(u => u.id === activeContactId);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !activeContactId) return;

        const message: ChatMessage = {
            id: Date.now(),
            senderId: user.id,
            text: newMessage,
            timestamp: Date.now(),
        };

        // Optimistically update UI
        const updatedConversations = conversations.map(convo => {
            if (convo.contactId === activeContactId) {
                return { ...convo, messages: [...convo.messages, message] };
            }
            return convo;
        });
        if (!updatedConversations.some(c => c.contactId === activeContactId)) {
            updatedConversations.push({ contactId: activeContactId, messages: [message]});
        }
        setConversations(updatedConversations);
        setNewMessage('');

        await fetch('/api/chats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contactId: activeContactId, message }),
        });
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] max-w-7xl mx-auto bg-white dark:bg-lynix-dark-blue shadow-2xl rounded-2xl overflow-hidden">
            {/* Contacts List */}
            <div className="w-1/3 border-r dark:border-gray-700 overflow-y-auto">
                 <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold">Chats</h2>
                </div>
                {users.filter(u => u.id !== user?.id && u.features.chat).map(contact => (
                    <button key={contact.id} onClick={() => setActiveContactId(contact.id)}
                        className={`w-full flex items-center p-4 space-x-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 ${activeContactId === contact.id ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}
                    >
                        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-lynix-blue text-white font-bold text-sm">
                            {contact.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold">{contact.username}</p>
                            <p className="text-sm text-gray-500 truncate">
                                {conversations.find(c => c.contactId === contact.id)?.messages.slice(-1)[0]?.text || 'No messages yet'}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {activeContact ? (
                    <>
                        <div className="p-4 border-b dark:border-gray-700 flex items-center space-x-3">
                            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-lynix-blue text-white font-bold text-sm">
                                {activeContact.username.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-xl font-bold">{activeContact.username}</h3>
                        </div>

                        <div className="flex-grow p-4 overflow-y-auto space-y-4">
                            {isLoading ? <p className="text-gray-500">Loading chat...</p> : activeConversation?.messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs md:max-w-md lg:max-w-xl px-4 py-2 rounded-2xl ${msg.senderId === user?.id ? 'bg-lynix-blue text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                             <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:ring-lynix-blue focus:border-lynix-blue rounded-full transition"
                                />
                                <button onClick={handleSendMessage} className="bg-lynix-blue text-white rounded-full p-3 hover:bg-lynix-blue/90 transition">
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Select a contact to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
