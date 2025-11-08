import React, { useState, useEffect, useMemo } from 'react';
import { Note } from '../types';
import { PlusIcon, TrashIcon } from '../components/icons/Icons';
import { useApp } from '../contexts/AppContext';

const NotepadPage: React.FC = () => {
    const { user } = useApp();
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchNotes = async () => {
            setIsLoading(true);
            try {
                // In a real app, user identity would be confirmed via a secure token
                const response = await fetch(`/api/notes?userId=${user.id}`);
                if(response.ok) {
                    const data = await response.json();
                    setNotes(data);
                     if (data.length > 0 && !activeNoteId) {
                        setActiveNoteId(data.sort((a,b) => b.lastModified - a.lastModified)[0].id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotes();
    }, [user]);

    const activeNote = useMemo(() => notes.find(note => note.id === activeNoteId), [notes, activeNoteId]);

    const createNewNote = async () => {
        if (!user) return;
        const response = await fetch('/api/notes?userId=' + user.id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'New Note', content: '' }),
        });
        if (response.ok) {
            const newNote = await response.json();
            setNotes([newNote, ...notes]);
            setActiveNoteId(newNote.id);
        }
    };

    const deleteNote = async (noteId: number) => {
        if (!user) return;
        const response = await fetch('/api/notes?userId=' + user.id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: noteId }),
        });
        if (response.ok) {
            const newNotes = notes.filter(note => note.id !== noteId);
            setNotes(newNotes);
            if(activeNoteId === noteId) {
                setActiveNoteId(newNotes.length > 0 ? sortedNotes[0].id : null);
            }
        }
    };

    const updateNote = async (field: 'title' | 'content', value: string) => {
        if (!activeNoteId || !user) return;
        
        // Optimistic UI update
        const oldNotes = notes;
        const updatedNotes = notes.map(note =>
            note.id === activeNoteId
                ? { ...note, [field]: value, lastModified: Date.now() }
                : note
        );
        setNotes(updatedNotes);

        const noteToUpdate = updatedNotes.find(n => n.id === activeNoteId);
        const response = await fetch('/api/notes?userId=' + user.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteToUpdate),
        });

        if (!response.ok) {
            // Revert on failure
            setNotes(oldNotes);
            alert("Failed to save note.");
        }
    };
    
    const sortedNotes = useMemo(() => {
        return [...notes].sort((a, b) => b.lastModified - a.lastModified);
    }, [notes]);

    return (
        <div className="flex h-[calc(100vh-10rem)] max-w-7xl mx-auto bg-white dark:bg-lynix-dark-blue shadow-2xl rounded-2xl overflow-hidden">
            {/* Notes List */}
            <div className="w-1/3 border-r dark:border-gray-700 flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Notepad</h1>
                    <button onClick={createNewNote} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <PlusIcon />
                    </button>
                </div>
                <div className="overflow-y-auto">
                    {isLoading ? <p className="p-4 text-gray-500">Loading notes...</p> : sortedNotes.map(note => (
                         <div key={note.id} onClick={() => setActiveNoteId(note.id)} className={`p-4 border-b dark:border-gray-700 cursor-pointer ${note.id === activeNoteId ? 'bg-lynix-light-blue/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                            <h3 className="font-bold truncate">{note.title || 'Untitled Note'}</h3>
                            <p className="text-sm text-gray-500 truncate">{note.content || 'No content'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col">
                {activeNote ? (
                    <>
                        <div className="p-2 border-b dark:border-gray-700 flex items-center">
                            <input
                                type="text"
                                value={activeNote.title}
                                onChange={(e) => updateNote('title', e.target.value)}
                                placeholder="Note Title"
                                className="w-full p-2 text-xl font-bold bg-transparent focus:outline-none"
                            />
                            <button onClick={() => deleteNote(activeNote.id)} className="p-2 rounded-full text-red-500 hover:bg-red-500/10">
                                <TrashIcon />
                            </button>
                        </div>
                        <textarea
                            value={activeNote.content}
                            onChange={(e) => updateNote('content', e.target.value)}
                            className="w-full h-full flex-grow p-4 bg-transparent focus:outline-none resize-none text-base leading-7"
                            placeholder="Start typing your notes here..."
                        />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>{isLoading ? 'Loading...' : 'Create or select a note to start editing.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotepadPage;
