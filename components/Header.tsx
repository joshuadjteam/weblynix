
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Page, UserRole } from '../types';
import { 
    LogoIcon, GridIcon, LinkIcon, BellIcon, SunIcon, MoonIcon,
    MailIcon, MessageSquareIcon, FileTextIcon, ContactIcon, CalculatorIcon, SparklesIcon, PhoneIcon
} from './icons/Icons';

const Header: React.FC = () => {
    const { theme, toggleTheme, user, signOut, setCurrentPage } = useApp();
    const [appsMenuOpen, setAppsMenuOpen] = useState(false);
    const [linksMenuOpen, setLinksMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const appsMenuRef = useRef<HTMLDivElement>(null);
    const linksMenuRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const appItems = [
        { name: Page.LOCAL_MAIL, enabled: user?.features.mail ?? false, icon: <MailIcon /> },
        { name: Page.CHAT, enabled: user?.features.chat ?? false, icon: <MessageSquareIcon /> },
        { name: Page.NOTEPAD, enabled: true, icon: <FileTextIcon /> },
        { name: Page.CONTACT, enabled: true, icon: <ContactIcon /> },
        { name: Page.CALCULATOR, enabled: true, icon: <CalculatorIcon /> },
        { name: Page.AI, enabled: user?.features.ai ?? true, icon: <SparklesIcon /> }, // AI enabled for anonymous
        { name: Page.DIALER, enabled: user?.features.dialer ?? false, icon: <PhoneIcon /> },
    ];

    const linkItems = [
        { name: "MyPortal", href: "https://sites.google.com/gcp.lynixity.x10.bz/myportal/home" },
        { name: "Buy a product", href: "https://darshanjoshuakesavaruban.fwscheckout.com/" }
    ];

    const handlePageChange = (page: Page) => {
        setCurrentPage(page);
        setAppsMenuOpen(false);
        setProfileMenuOpen(false);
    }
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (appsMenuRef.current && !appsMenuRef.current.contains(event.target as Node)) setAppsMenuOpen(false);
            if (linksMenuRef.current && !linksMenuRef.current.contains(event.target as Node)) setLinksMenuOpen(false);
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setProfileMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <header className="bg-white/70 dark:bg-lynix-dark-blue/70 backdrop-blur-md shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                         <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(Page.HOME);}} className="flex items-center space-x-2">
                             <LogoIcon className="h-10 w-auto" />
                         </a>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Links Dropdown */}
                        <div className="relative" ref={linksMenuRef}>
                            <button onClick={() => setLinksMenuOpen(!linksMenuOpen)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lynix-blue">
                                <LinkIcon />
                            </button>
                            {linksMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                                    {linkItems.map(item => (
                                        <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{item.name}</a>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Apps Dropdown */}
                        <div className="relative" ref={appsMenuRef}>
                            <button onClick={() => setAppsMenuOpen(!appsMenuOpen)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lynix-blue">
                                <GridIcon />
                            </button>
                            {appsMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg p-2 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                                    <div className="grid grid-cols-3 gap-2">
                                        {appItems.map(app => (
                                            <button key={app.name} onClick={() => handlePageChange(app.name)} disabled={!app.enabled} className={`flex flex-col items-center p-2 rounded-md text-xs text-center ${app.enabled ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}>
                                                <div className="h-8 w-8 mb-1 flex items-center justify-center text-gray-600 dark:text-gray-300">{app.icon}</div>
                                                <span className="text-gray-700 dark:text-gray-200">{app.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lynix-blue">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                        
                        {user ? (
                            <>
                                {/* Notifications */}
                                <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lynix-blue">
                                    <BellIcon />
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={profileMenuRef}>
                                    <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center justify-center h-8 w-8 rounded-full bg-lynix-blue text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lynix-blue">
                                        {user.username.charAt(0).toUpperCase()}
                                    </button>
                                     {profileMenuOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                                            <div className="px-4 py-3">
                                                <p className="text-sm text-gray-700 dark:text-white">Signed in as</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.username}</p>
                                            </div>
                                            <div className="border-t border-gray-200 dark:border-gray-700"></div>
                                            <button onClick={() => handlePageChange(Page.PROFILE)} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</button>
                                            {user.role === UserRole.ADMIN && (
                                                <button onClick={() => handlePageChange(Page.ADMIN_PORTAL)} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Admin Portal</button>
                                            )}
                                            <div className="border-t border-gray-200 dark:border-gray-700"></div>
                                            <button onClick={signOut} className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                             <button
                                onClick={() => setCurrentPage(Page.SIGN_IN)}
                                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-lynix-blue hover:bg-lynix-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lynix-blue"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
