import React, { useState } from 'react';
import { PhoneIcon, KeypadIcon, MicOffIcon, VolumeUpIcon, UserIcon } from '@/components/icons/Icons';

const DialerPage: React.FC = () => {
    const [number, setNumber] = useState('');
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'failed'>('idle');

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
        setCallStatus('idle');
        setNumber('');
    };

    const keypadButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

    if (callStatus === 'calling' || callStatus === 'connected' || callStatus === 'failed') {
        return (
             <div className="flex justify-center items-center">
                <div className="w-full max-w-sm bg-white dark:bg-lynix-dark-blue shadow-2xl rounded-2xl p-8 space-y-6 text-center">
                    <div className="flex flex-col items-center space-y-4 text-white">
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


    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-xs bg-white dark:bg-lynix-dark-blue shadow-2xl rounded-2xl p-4 space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-center h-16 flex items-center justify-center">
                    <input 
                        type="text" 
                        value={number} 
                        readOnly 
                        className="bg-transparent w-full text-center text-3xl font-mono focus:outline-none"
                        placeholder="lDialer"
                    />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {keypadButtons.map(key => (
                        <button key={key} onClick={() => handleKeyPress(key)} className="py-4 rounded-lg text-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                            {key}
                        </button>
                    ))}
                </div>
                 <div className="flex justify-center items-center space-x-2">
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
        </div>
    );
};

export default DialerPage;