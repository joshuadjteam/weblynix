import React, { useState, useEffect } from 'react';
import { PhoneIcon, KeypadIcon, MicOffIcon, VolumeUpIcon, UserIcon, HistoryIcon } from '@/components/icons/Icons';
import { CallRecord, CallStatus } from '@/types';

// Helper to format duration from seconds to a readable string like "1m 25s"
const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    let result = '';
    if (minutes > 0) result += `${minutes}m `;
    if (remainingSeconds > 0) result += `${remainingSeconds}s`;
    return result.trim();
};

// Helper to format timestamp into a user-friendly string like "Today, 10:45 AM"
const formatTimestamp = (timestamp: number): string => {
    const callDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const timeFormat: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

    if (callDate.toDateString() === today.toDateString()) {
        return `Today, ${callDate.toLocaleTimeString('en-US', timeFormat)}`;
    }
    if (callDate.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${callDate.toLocaleTimeString('en-US', timeFormat)}`;
    }
    return callDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};


const DialerPage: React.FC = () => {
    const [number, setNumber] = useState('');
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'failed'>('idle');
    const [callStartTime, setCallStartTime] = useState<number | null>(null);
    const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
    const [activeTab, setActiveTab] = useState<'keypad' | 'history'>('keypad');

    // Load and save call history from/to localStorage
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('lynix-call-history');
            if (savedHistory) {
                setCallHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error("Failed to load call history:", error);
        }
    }, []);

    useEffect(() => {
        // Don't save the initial empty array on first load if it's empty
        if (callHistory.length > 0) {
             localStorage.setItem('lynix-call-history', JSON.stringify(callHistory));
        }
    }, [callHistory]);

    const handleKeyPress = (key: string) => {
        if (number.length < 15) {
            setNumber(number + key);
        }
    };

    const handleDelete = () => {
        setNumber(number.slice(0, -1));
    };

    const handleCall = () => {
        if (!number.trim()) return;
        setCallStartTime(Date.now());
        setCallStatus('calling');
        setTimeout(() => {
            if (number !== '555') {
                setCallStatus('connected');
            } else {
                setCallStatus('failed');
            }
        }, 2000);
    };
    
    const handleEndCall = () => {
        if (callStartTime) {
            const duration = Math.round((Date.now() - callStartTime) / 1000);
            const status = callStatus === 'failed' ? CallStatus.FAILED : CallStatus.CONNECTED;
            
            const newRecord: CallRecord = {
                id: callStartTime,
                number: number,
                status: status,
                timestamp: callStartTime,
                duration: status === CallStatus.CONNECTED ? duration : 0,
            };
            setCallHistory(prev => [newRecord, ...prev]);
        }
        
        setCallStatus('idle');
        setNumber('');
        setCallStartTime(null);
    };

    const keypadButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

    // In-Call Screen
    if (callStatus === 'calling' || callStatus === 'connected' || callStatus === 'failed') {
        return (
             <div className="flex justify-center items-center">
                <div className="w-full max-w-sm bg-white dark:bg-lynix-dark-blue shadow-2xl rounded-2xl p-8 space-y-6 text-center">
                    <div className="flex flex-col items-center space-y-4">
                         <div className="w-24 h-24 rounded-full bg-lynix-light-blue dark:bg-lynix-blue flex items-center justify-center">
                            <UserIcon />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{number}</h2>
                        <p className={`text-lg ${callStatus === 'failed' ? 'text-red-500' : 'text-gray-400'}`}>
                            {callStatus === 'calling' && <span className="animate-pulse">Calling...</span>}
                            {callStatus === 'connected' && 'Connected'}
                            {callStatus === 'failed' && 'Call Failed'}
                        </p>
                    </div>
                    {callStatus === 'connected' && (
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <button className="flex flex-col items-center p-3 rounded-lg bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-700"><MicOffIcon/> Mute</button>
                            <button className="flex flex-col items-center p-3 rounded-lg bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-700"><KeypadIcon/> Keypad</button>
                            <button className="flex flex-col items-center p-3 rounded-lg bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-700"><VolumeUpIcon/> Speaker</button>
                        </div>
                    )}
                    <div className="pt-6">
                        <button onClick={handleEndCall} className="w-20 h-20 flex items-center justify-center mx-auto bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition">
                            <PhoneIcon className="transform -rotate-135" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    const KeypadView = () => (
         <div className="flex flex-col h-full">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-center h-16 flex items-center justify-center mb-4">
                <input 
                    type="text" 
                    value={number} 
                    readOnly 
                    className="bg-transparent w-full text-center text-3xl font-mono focus:outline-none"
                    placeholder="lDialer"
                />
            </div>
            <div className="grid grid-cols-3 gap-2 flex-grow">
                {keypadButtons.map(key => (
                    <button key={key} onClick={() => handleKeyPress(key)} className="py-4 rounded-lg text-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                        {key}
                    </button>
                ))}
            </div>
             <div className="flex justify-center items-center space-x-2 mt-4">
                <div className="w-1/3"></div>
                <button onClick={handleCall} className="w-16 h-16 flex items-center justify-center bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition">
                    <PhoneIcon />
                </button>
                <div className="w-1/3 text-right">
                    {number.length > 0 && 
                     <button onClick={handleDelete} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
                    </button>}
                </div>
            </div>
        </div>
    );
    
    const HistoryView = () => (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold text-center mb-4">Call History</h2>
            {callHistory.length === 0 ? (
                 <div className="flex-grow flex items-center justify-center text-gray-500">
                    <p>No recent calls.</p>
                </div>
            ) : (
                <ul className="overflow-y-auto space-y-2 pr-2">
                    {callHistory.map(record => (
                         <li key={record.id} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <PhoneIcon className={`w-5 h-5 ${record.status === CallStatus.FAILED ? 'text-red-500' : 'text-green-500'}`} />
                                <div>
                                    <p className={`font-semibold ${record.status === CallStatus.FAILED ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{record.number}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimestamp(record.timestamp)}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{formatDuration(record.duration)}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-xs bg-white dark:bg-lynix-dark-blue shadow-2xl rounded-2xl p-4 flex flex-col h-[550px]">
                <div className="flex-grow overflow-hidden">
                    {activeTab === 'keypad' ? <KeypadView /> : <HistoryView />}
                </div>
                {/* Tabs */}
                <div className="flex justify-around border-t dark:border-gray-700 pt-3 mt-2">
                    <button 
                        onClick={() => setActiveTab('keypad')} 
                        className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition ${activeTab === 'keypad' ? 'text-lynix-blue' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <KeypadIcon />
                        <span className="text-xs font-medium">Keypad</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')} 
                        className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition ${activeTab === 'history' ? 'text-lynix-blue' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <HistoryIcon />
                        <span className="text-xs font-medium">History</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DialerPage;