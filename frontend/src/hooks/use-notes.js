import { useState, useEffect } from 'react';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  
  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('studysphere-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes from localStorage', e);
      }
    } else {
      // Initialize with mock data
      setNotes([
        {
          id: 1,
          title: 'Physics Lecture Notes',
          content: 'Today we covered quantum mechanics and the principles of wave-particle duality. Key concepts include the Heisenberg uncertainty principle and Schrödinger equation.',
          tags: ['Physics', 'Quantum Mechanics'],
          createdAt: '2023-10-15T10:30:00Z',
          updatedAt: '2023-10-15T10:30:00Z'
        },
        {
          id: 2,
          title: 'Calculus Study Guide',
          content: 'Derivatives and integrals are fundamental concepts in calculus. Remember the chain rule for derivatives and integration by parts for complex integrals.',
          tags: ['Mathematics', 'Calculus'],
          createdAt: '2023-10-14T15:45:00Z',
          updatedAt: '2023-10-14T15:45:00Z'
        },
        {
          id: 3,
          title: 'Computer Science Algorithms',
          content: 'Sorting algorithms: Bubble sort has O(n²) time complexity, while merge sort and quick sort have O(n log n) average time complexity.',
          tags: ['Computer Science', 'Algorithms'],
          createdAt: '2023-10-13T09:15:00Z',
          updatedAt: '2023-10-13T09:15:00Z'
        }
      ]);
    }
  }, []);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studysphere-notes', JSON.stringify(notes));
  }, [notes]);
  
  const saveNote = (note) => {
    if (note.id) {
      // Update existing note
      setNotes(notes.map(n => n.id === note.id ? note : n));
    } else {
      // Add new note
      setNotes([...notes, { ...note, id: Date.now() }]);
    }
    setEditingNote(null);
  };
  
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  const startEditing = (note) => {
    setEditingNote(note);
  };
  
  const cancelEditing = () => {
    setEditingNote(null);
  };
  
  return {
    notes,
    editingNote,
    saveNote,
    deleteNote,
    startEditing,
    cancelEditing
  };
};