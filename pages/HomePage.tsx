
import React from 'react';
import { useClock } from '../hooks/useClock';
import PulsingQuestionIcon from '../components/PulsingQuestionIcon';
import { useApp } from '../contexts/AppContext';
import { SearchIcon } from '../components/icons/Icons';

const HomePage: React.FC = () => {
    const { user } = useApp();
    const now = useClock();

    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
        if(query) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center h-full">
             <div className="max-w-4xl mx-auto bg-white dark:bg-lynix-dark-blue/50 p-8 rounded-2xl shadow-lg">
                 <h1 className="text-4xl md:text-5xl font-bold text-lynix-blue dark:text-lynix-light-blue mb-4">
                     Welcome to Lynix{user ? `, ${user.username}`: ''}!
                 </h1>
                 <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                     Welcome to Lynix, where innovation in technology and coding comes to life. Since our inception in January 2024, we've been dedicated to pushing the boundaries of web development. We launched our first suite of products in July 2024 and began sharing our journey on our YouTube channel, '@DarCodr'. Today, our primary mission remains rooted in creating powerful coding solutions, while expanding our services to include reliable email support, crystal-clear SIP Voice communication, and more. Explore what we have to offer.
                 </p>
                <div className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-8 space-y-1">
                     <p>{now.toLocaleDateString(undefined, dateOptions)}</p>
                     <p>{now.toLocaleTimeString(undefined, timeOptions)}</p>
                </div>
                
                 <form onSubmit={handleSearch} className="max-w-lg w-full mx-auto relative">
                     <input
                         type="search"
                         name="q"
                         placeholder="Search with Google"
                         className="w-full py-3 pl-4 pr-12 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:ring-lynix-blue focus:border-lynix-blue rounded-full transition"
                     />
                     <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-lynix-blue dark:hover:text-lynix-light-blue rounded-full">
                        <SearchIcon/>
                     </button>
                 </form>
             </div>
             <PulsingQuestionIcon />
        </div>
    );
};

export default HomePage;
