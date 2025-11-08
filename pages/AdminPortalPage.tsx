import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { User, UserRole, BillingStatus, UserFeatures } from '@/types';
import { PlusIcon, EditIcon, TrashIcon, XIcon } from '@/components/icons/Icons';

type FeatureKey = keyof UserFeatures;

const defaultNewUser: Omit<User, 'id'> = {
    username: '',
    email: null,
    sipTalkId: null,
    password: '',
    role: UserRole.STANDARD,
    billingStatus: BillingStatus.ON_TIME,
    features: { dialer: false, ai: false, mail: false, chat: false },
};

interface UserFormModalProps {
    user: Partial<User> | null;
    onSave: (user: User) => Promise<void>;
    onClose: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState<Partial<User>>(defaultNewUser);

    useEffect(() => {
        setFormData(user ? { ...user, password: '' } : { ...defaultNewUser });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (feature: FeatureKey) => {
        setFormData(prev => ({
            ...prev,
            features: { ...prev.features, [feature]: !prev.features?.[feature] }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData as User);
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-lynix-dark-blue rounded-lg shadow-2xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{user.id ? 'Edit User' : 'Add User'}</h2>
                    <button onClick={onClose}><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Form Fields */}
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input type="text" name="username" value={formData.username || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input type="password" name="password" value={formData.password || ''} onChange={handleChange} placeholder={user.id ? "Leave blank to keep current" : ""} required={!user.id} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">LynixSIPTalk ID</label>
                        <input type="text" name="sipTalkId" value={formData.sipTalkId || ''} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue">
                            {Object.values(UserRole).filter(r => r !== UserRole.GUEST).map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Billing Status</label>
                        <select name="billingStatus" value={formData.billingStatus} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue">
                             {Object.values(BillingStatus).map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Features</label>
                        <div className="mt-2 space-y-2">
                            {Object.keys(defaultNewUser.features).map(feature => (
                                <label key={feature} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.features?.[feature as FeatureKey] || false}
                                        onChange={() => handleFeatureChange(feature as FeatureKey)}
                                        className="rounded text-lynix-blue focus:ring-lynix-blue"
                                    />
                                    <span className="ml-2 capitalize">{feature}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-lynix-blue text-white hover:bg-lynix-blue/90">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminPortalPage: React.FC = () => {
    const { users, addUser, updateUser, deleteUser } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

    const handleAddUser = () => {
        setEditingUser(defaultNewUser);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await deleteUser(userId);
        }
    };
    
    const handleSaveUser = async (userToSave: User) => {
        if (userToSave.id) {
            await updateUser(userToSave);
        } else {
            await addUser(userToSave);
        }
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };
    
    const getRoleClass = (role: UserRole) => {
        switch(role) {
            case UserRole.ADMIN: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case UserRole.STANDARD: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case UserRole.TRIAL: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case UserRole.CUSTOM: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    }
     const getBillingStatusClass = (status: BillingStatus) => {
        switch(status) {
            case BillingStatus.ON_TIME: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case BillingStatus.OVERDUE: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case BillingStatus.SUSPENDED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return '';
        }
    }


    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Portal</h1>
                <button onClick={handleAddUser} className="flex items-center space-x-2 px-4 py-2 rounded-md bg-lynix-blue text-white hover:bg-lynix-blue/90">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add User</span>
                </button>
            </div>
            <div className="bg-white dark:bg-lynix-dark-blue shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Billing</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-lynix-dark-blue divide-y divide-gray-200 dark:divide-gray-700">
                        {users.filter(u => u.role !== UserRole.GUEST).map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBillingStatusClass(user.billingStatus)}`}>
                                      {user.billingStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => handleEditUser(user)} className="text-lynix-blue hover:text-lynix-blue/80"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {isModalOpen && <UserFormModal user={editingUser} onSave={handleSaveUser} onClose={handleCloseModal} />}
        </div>
    );
};

export default AdminPortalPage;