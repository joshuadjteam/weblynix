import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Page } from '@/types';

const PulsingQuestionIcon: React.FC = () => {
    const { setCurrentPage } = useApp();

    const handleClick = () => {
        setCurrentPage(Page.AI);
    };

    return (
        <button 
            onClick={handleClick}
            className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full flex items-center justify-center bg-lynix-blue dark:bg-lynix-light-blue shadow-2xl focus:outline-none focus:ring-4 focus:ring-lynix-blue/50 dark:focus:ring-lynix-light-blue/50"
            aria-label="Ask LynxAI"
        >
            <span className="absolute inline-flex h-full w-full rounded-full bg-lynix-blue dark:bg-lynix-light-blue opacity-75 animate-pulse-slow"></span>
            <span className="relative text-3xl font-bold text-white dark:text-lynix-dark-blue">?</span>
        </button>
    );
};

export default PulsingQuestionIcon;