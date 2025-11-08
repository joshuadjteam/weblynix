
import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Header from './components/Header';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import LocalMailPage from './pages/LocalMailPage';
import ChatPage from './pages/ChatPage';
import NotepadPage from './pages/NotepadPage';
import ContactPage from './pages/ContactPage';
import CalculatorPage from './pages/CalculatorPage';
import LynxAiPage from './pages/LynxAiPage';
import DialerPage from './pages/DialerPage';
import ProfilePage from './pages/ProfilePage';
import AdminPortalPage from './pages/AdminPortalPage';
import { Page, UserRole } from './types';

const PageRenderer: React.FC = () => {
    const { currentPage, user, setCurrentPage } = useApp();

    useEffect(() => {
        let isAccessible = true;
        let redirectTo: Page | null = null;

        const isUserLoggedIn = !!user;

        switch (currentPage) {
            case Page.LOCAL_MAIL:
                isAccessible = isUserLoggedIn && user.features.mail;
                if (!isUserLoggedIn) redirectTo = Page.SIGN_IN;
                else if (!isAccessible) redirectTo = Page.HOME;
                break;
            case Page.CHAT:
                isAccessible = isUserLoggedIn && user.features.chat;
                if (!isUserLoggedIn) redirectTo = Page.SIGN_IN;
                else if (!isAccessible) redirectTo = Page.HOME;
                break;
            case Page.DIALER:
                 isAccessible = isUserLoggedIn && user.features.dialer;
                 if (!isUserLoggedIn) redirectTo = Page.SIGN_IN;
                 else if (!isAccessible) redirectTo = Page.HOME;
                break;
            case Page.PROFILE:
                isAccessible = isUserLoggedIn;
                if (!isAccessible) redirectTo = Page.SIGN_IN;
                break;
            case Page.ADMIN_PORTAL:
                isAccessible = isUserLoggedIn && user.role === UserRole.ADMIN;
                if (!isUserLoggedIn) redirectTo = Page.SIGN_IN;
                else if (!isAccessible) redirectTo = Page.HOME;
                break;
            case Page.SIGN_IN:
                if (isUserLoggedIn) {
                    isAccessible = false;
                    redirectTo = Page.HOME;
                }
                break;
            default:
                break;
        }

        if (!isAccessible && redirectTo) {
            setCurrentPage(redirectTo);
        }
    }, [currentPage, user, setCurrentPage]);

    const isPageCurrentlyAccessible = () => {
         switch (currentPage) {
            case Page.LOCAL_MAIL: return !!user?.features.mail;
            case Page.CHAT: return !!user?.features.chat;
            case Page.DIALER: return !!user?.features.dialer;
            case Page.PROFILE: return !!user;
            case Page.ADMIN_PORTAL: return user?.role === UserRole.ADMIN;
            case Page.SIGN_IN: return !user;
            default: return true;
        }
    }

    if (!isPageCurrentlyAccessible()) {
        return <div className="text-center p-8">Loading...</div>;
    }


    switch (currentPage) {
        case Page.SIGN_IN:
            return <SignInPage />;
        case Page.HOME:
            return <HomePage />;
        case Page.LOCAL_MAIL:
            return <LocalMailPage />;
        case Page.CHAT:
            return <ChatPage />;
        case Page.NOTEPAD:
            return <NotepadPage />;
        case Page.CONTACT:
            return <ContactPage />;
        case Page.CALCULATOR:
            return <CalculatorPage />;
        case Page.AI:
            return <LynxAiPage />;
        case Page.DIALER:
            return <DialerPage />;
        case Page.PROFILE:
            return <ProfilePage />;
        case Page.ADMIN_PORTAL:
            return <AdminPortalPage />;
        default:
            return <HomePage />;
    }
};

const MainApp: React.FC = () => {
    const { theme } = useApp();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Header />
            <main className="flex-grow p-4 sm:p-6 lg:p-8">
                <PageRenderer />
            </main>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AppProvider>
            <MainApp />
        </AppProvider>
    );
};

export default App;
