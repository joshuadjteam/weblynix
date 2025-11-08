import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { User } from '@/types';
import { SaveIcon, EditIcon } from '@/components/icons/Icons';

const ProfilePage: React.FC = () => {
    const { user, updateUser, users } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                sipTalkId: user.sipTalkId,
            });
        }
    }, [user, isEditing]);

    if (!user) {
        return <div>Loading profile...</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    }

    const handleSaveProfile = async () => {
        setMessage(null);
        const fullUser = users.find(u => u.id === user.id);
        if (fullUser) {
             const updatedUser: User = { ...fullUser, ...formData };
             await updateUser(updatedUser);
             setMessage({ type: 'success', text: 'Profile updated successfully!' });
             setIsEditing(false);
        } else {
             setMessage({ type: 'error', text: 'Could not find user to update.' });
        }
    };
    
    const handleSavePassword = async () => {
        setMessage(null);
        // Password check is now on the backend, but we need the full user object from the state
        // to get the current password for comparison or to send to backend.
        // For this demo, we'll fetch the *real* full user object from the main user list.
        const fullUser = users.find(u => u.id === user.id);

        if (!fullUser || fullUser.password !== passwords.current) {
            setMessage({ type: 'error', text: 'Current password is incorrect.'});
            return;
        }
        if (passwords.new.length < 6) {
             setMessage({ type: 'error', text: 'New password must be at least 6 characters.'});
            return;
        }
        if (passwords.new !== passwords.confirm) {
             setMessage({ type: 'error', text: 'New passwords do not match.'});
            return;
        }

        const updatedUser: User = { ...fullUser, password: passwords.new };
        await updateUser(updatedUser);
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswords({ current: '', new: '', confirm: '' });
    }
    
    const sections = ["Your Profile", "Security", "Billing", "LynxAI Portal"];
    const [activeSection, setActiveSection] = React.useState(sections[0]);

    return (
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Profile & Settings</h1>
             {message && (
                <div className={`p-4 mb-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4">
                    <nav className="flex flex-col space-y-2">
                        {sections.map(section => (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                className={`text-left px-4 py-2 rounded-md font-medium transition-colors ${activeSection === section ? 'bg-lynix-blue text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                {section}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="md:w-3/4">
                    <div className="bg-white dark:bg-lynix-dark-blue p-6 rounded-lg shadow-md">
                        {activeSection === "Your Profile" && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold">Your Profile</h2>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm">
                                            <EditIcon className="w-4 h-4" /><span>Edit</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button onClick={() => setIsEditing(false)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm">Cancel</button>
                                            <button onClick={handleSaveProfile} className="flex items-center space-x-2 px-3 py-1 rounded-md bg-lynix-blue text-white hover:bg-lynix-blue/90 text-sm">
                                                <SaveIcon className="w-4 h-4" /><span>Save</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Username</label>
                                        <input type="text" name="username" value={formData.username || ''} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue disabled:opacity-70" />
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-gray-500">Email</label>
                                        <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue disabled:opacity-70" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">LynixSIPTalk ID</label>
                                        <input type="text" name="sipTalkId" value={formData.sipTalkId || ''} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue disabled:opacity-70" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Role</label>
                                        <p className="mt-1 text-lg">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === "Security" && (
                             <div>
                                <h2 className="text-2xl font-bold mb-4">Change Password</h2>
                                <div className="space-y-4">
                                     <div>
                                        <label className="block text-sm font-medium text-gray-500">Current Password</label>
                                        <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">New Password</label>
                                        <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Confirm New Password</label>
                                        <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue" />
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={handleSavePassword} className="flex items-center space-x-2 px-4 py-2 rounded-md bg-lynix-blue text-white hover:bg-lynix-blue/90 text-sm">
                                            <SaveIcon className="w-4 h-4"/><span>Change Password</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === "Billing" && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Billing</h2>
                                <p><strong>Status:</strong> {user.billingStatus}</p>
                                <p className="mt-4 text-gray-500">Billing information is managed here. (Demo)</p>
                            </div>
                        )}
                        {activeSection === "LynxAI Portal" && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">LynxAI Portal</h2>
                                <p className="text-gray-500">LynxAI settings and usage can be managed here. (Demo)</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;