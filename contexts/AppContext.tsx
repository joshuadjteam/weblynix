import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Page, User } from '@/types';
import { GUEST_USER } from '@/constants';

type AppContextType = {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    user: User | null;
    signIn: (identifier: string, password: string) => Promise<boolean>;
    signInAsGuest: () => void;
    signOut: () => void;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    users: User[];
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    deleteUser: (userId: number) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('lynix-theme') as 'light' | 'dark') || 'dark';
    });
    
    const [user, setUser] = useState<User | null>(() => {
        try {
            const savedUser = localStorage.getItem('lynix-user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            return null;
        }
    });
    
    const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        localStorage.setItem('lynix-theme', theme);
    }, [theme]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('lynix-user', JSON.stringify(user));
        } else {
            localStorage.removeItem('lynix-user');
        }
    }, [user]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const signIn = async (identifier: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', identifier, password }),
            });
            if (response.ok) {
                const signedInUser = await response.json();
                setUser(signedInUser);
                setCurrentPage(Page.HOME);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Sign in failed:", error);
            return false;
        }
    };

    const signInAsGuest = () => {
        setUser(GUEST_USER);
        setCurrentPage(Page.HOME);
    };

    const signOut = () => {
        setUser(null);
        setCurrentPage(Page.HOME);
    };
    
    const addUser = async (userToAdd: Omit<User, 'id'>) => {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userToAdd),
        });
        if (response.ok) {
            await fetchUsers(); // Refresh user list
        }
    };

    const updateUser = async (userToUpdate: User) => {
       const response = await fetch('/api/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userToUpdate),
        });
        if (response.ok) {
             const updatedUserFromServer = await response.json();
             if (user?.id === updatedUserFromServer.id) {
                setUser(updatedUserFromServer);
            }
            await fetchUsers();
        }
    };

    const deleteUser = async (userId: number) => {
        const response = await fetch('/api/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId }),
        });
        if (response.ok) {
            await fetchUsers();
        }
    };


    return (
        <AppContext.Provider value={{ theme, toggleTheme, user, signIn, signInAsGuest, signOut, currentPage, setCurrentPage, users, addUser, updateUser, deleteUser }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};