import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Contact } from '@/types';
import { PlusIcon, EditIcon, TrashIcon, XIcon, UserIcon } from '@/components/icons/Icons';

interface ContactFormModalProps {
    contact: Partial<Contact> | null;
    onSave: (contact: Partial<Contact>) => Promise<void>;
    onClose: () => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ contact, onSave, onClose }) => {
    const [formData, setFormData] = useState<Partial<Contact>>({});

    useEffect(() => {
        setFormData(contact || {});
    }, [contact]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };
    
    if (!contact) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-lynix-dark-blue rounded-lg shadow-2xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{contact.id ? 'Edit Contact' : 'Add Contact'}</h2>
                    <button onClick={onClose}><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-lynix-blue focus:ring-lynix-blue" />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-lynix-blue text-white hover:bg-lynix-blue/90">Save Contact</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


const ContactsPage: React.FC = () => {
    const { user } = useApp();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Partial<Contact> | null>(null);

    const fetchContacts = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await fetch(`/api/contacts?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setContacts(data);
            }
        } catch (error) {
            console.error("Failed to fetch contacts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [user]);

    const handleAddContact = () => {
        setEditingContact({});
        setIsModalOpen(true);
    };

    const handleEditContact = (contact: Contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };
    
    const handleDeleteContact = async (contactId: number) => {
        if(window.confirm('Are you sure you want to delete this contact?')) {
            await fetch(`/api/contacts?userId=${user?.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: contactId }),
            });
            await fetchContacts();
        }
    };

    const handleSaveContact = async (contact: Partial<Contact>) => {
        const url = `/api/contacts?userId=${user?.id}`;
        const method = contact.id ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact),
        });
        if (response.ok) {
            await fetchContacts();
            handleCloseModal();
        } else {
            alert('Failed to save contact.');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingContact(null);
    };


    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Contacts</h1>
                <button onClick={handleAddContact} className="flex items-center space-x-2 px-4 py-2 rounded-md bg-lynix-blue text-white hover:bg-lynix-blue/90">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Contact</span>
                </button>
            </div>
            {isLoading ? (
                <p className="text-center text-gray-500">Loading contacts...</p>
            ) : contacts.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-lynix-dark-blue rounded-lg shadow-md">
                    <UserIcon />
                    <h3 className="mt-2 text-xl font-semibold">No Contacts Yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Click "Add Contact" to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.map(contact => (
                        <div key={contact.id} className="bg-white dark:bg-lynix-dark-blue shadow-lg rounded-lg p-5 flex flex-col">
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{contact.name}</h3>
                                {contact.email && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.email}</p>}
                                {contact.phone && <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                                <button onClick={() => handleEditContact(contact)} className="text-lynix-blue hover:text-lynix-blue/80 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><EditIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleDeleteContact(contact.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isModalOpen && <ContactFormModal contact={editingContact} onSave={handleSaveContact} onClose={handleCloseModal} />}
        </div>
    );
};

// Add default export for ContactsPage component to fix import error.
export default ContactsPage;
