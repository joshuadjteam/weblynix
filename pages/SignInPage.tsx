import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { LogoIcon } from '@/components/icons/Icons';

const SignInPage: React.FC = () => {
    const { signIn, signInAsGuest } = useApp();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const success = await signIn(identifier, password);

        if (!success) {
            setError('Invalid credentials. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-lynix-dark-blue rounded-2xl shadow-2xl">
                <div className="flex justify-center">
                    <LogoIcon className="h-16 w-auto" />
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Sign in to your account
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="identifier"
                                name="identifier"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-lynix-blue focus:border-lynix-blue focus:z-10 sm:text-sm"
                                placeholder="Username, email, or LynixSIPTalk ID"
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-lynix-blue focus:border-lynix-blue focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-lynix-blue hover:bg-lynix-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lynix-blue disabled:bg-gray-500"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                <div className="flex items-center justify-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-lynix-dark-blue relative text-sm">Or</span>
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <button
                    onClick={signInAsGuest}
                    className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lynix-blue"
                >
                    Continue as Guest
                </button>
            </div>
        </div>
    );
};

export default SignInPage;