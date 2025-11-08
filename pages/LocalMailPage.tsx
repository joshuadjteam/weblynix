import React, { useState, useEffect } from 'react';
import { Mail } from '../types';
import { InboxIcon, SendIcon, TrashIcon, EditIcon } from '../components/icons/Icons';

const LocalMailPage: React.FC = () => {
    const [mails, setMails] = useState<Mail[]>([]);
    const [selectedMailId, setSelectedMailId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/mails');
                if (response.ok) {
                    const data: Mail[] = await response.json();
                    setMails(data);
                    if (data.length > 0) {
                        setSelectedMailId(data[0].id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch mails:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMails();
    }, []);


    const selectedMail = mails.find(m => m.id === selectedMailId);

    return (
        <div className="flex h-[calc(100vh-10rem)] max-w-7xl mx-auto bg-white dark:bg-lynix-dark-blue shadow-2xl rounded-2xl overflow-hidden">
            {/* Sidebar */}
            <div className="w-20 md:w-56 bg-gray-100 dark:bg-gray-800/50 p-4 border-r dark:border-gray-700 flex flex-col">
                 <button className="flex items-center justify-center md:justify-start space-x-3 w-full px-3 py-2 rounded-md bg-lynix-blue text-white font-semibold mb-6">
                    <EditIcon className="w-5 h-5" />
                    <span className="hidden md:inline">Compose</span>
                </button>
                <nav className="space-y-2">
                    <a href="#" className="flex items-center space-x-3 text-lynix-blue dark:text-lynix-light-blue bg-blue-100 dark:bg-blue-900/50 px-3 py-2 rounded-md font-bold">
                        <InboxIcon className="w-6 h-6" />
                        <span className="hidden md:inline">Inbox</span>
                        <span className="hidden md:inline ml-auto bg-lynix-blue text-white text-xs rounded-full px-2 py-0.5">{mails.filter(m => !m.read).length}</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md">
                        <SendIcon className="w-6 h-6" />
                        <span className="hidden md:inline">Sent</span>
                    </a>
                     <a href="#" className="flex items-center space-x-3 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md">
                        <TrashIcon className="w-6 h-6" />
                        <span className="hidden md:inline">Trash</span>
                    </a>
                </nav>
            </div>

            {/* Mail List */}
            <div className="w-1/3 border-r dark:border-gray-700 overflow-y-auto">
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold">Inbox</h2>
                </div>
                <div>
                    {isLoading ? <p className="p-4 text-gray-500">Loading mails...</p> : mails.map(mail => (
                        <button key={mail.id} onClick={() => setSelectedMailId(mail.id)} className={`w-full text-left p-4 border-b dark:border-gray-700 block hover:bg-gray-100 dark:hover:bg-gray-700/50 ${selectedMailId === mail.id ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}>
                            <div className="flex justify-between items-baseline">
                                <p className={`font-bold truncate ${!mail.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{mail.from.name}</p>
                                <p className="text-xs text-gray-500">{new Date(mail.timestamp).toLocaleDateString()}</p>
                            </div>
                            <p className={`truncate ${!mail.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>{mail.subject}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mail Content */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                {selectedMail ? (
                    <>
                        <div className="p-4 border-b dark:border-gray-700">
                            <h3 className="text-2xl font-bold">{selectedMail.subject}</h3>
                            <div className="flex items-center mt-2">
                                <div className="w-8 h-8 rounded-full bg-lynix-blue flex items-center justify-center text-white font-bold mr-3">{selectedMail.from.name.charAt(0)}</div>
                                <div>
                                    <p className="font-semibold">{selectedMail.from.name}</p>
                                    <p className="text-sm text-gray-500">{selectedMail.from.email}</p>
                                </div>
                                <p className="ml-auto text-sm text-gray-500">{new Date(selectedMail.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="p-6 flex-grow whitespace-pre-wrap">
                            {selectedMail.body}
                        </div>
                    </>
                ) : (
                     <div className="flex items-center justify-center h-full text-gray-500">
                        <p>{isLoading ? 'Loading...' : 'Select an email to read'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocalMailPage;
