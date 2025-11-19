import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '../hooks/use-notes';
import NoteCard from '../components/notes/note-card';
import NoteEditor from '../components/notes/note-editor';
import Button from '../components/ui/button';
import { Plus, Search } from 'lucide-react';

const Notes = () => {
  const {
    notes,
    editingNote,
    saveNote,
    deleteNote,
    startEditing,
    cancelEditing
  } = useNotes();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notes</h1>
          <p className="text-gray-600 mt-2">Capture and organize your study notes</p>
        </div>
          <Button 
          onClick={() => startEditing({})}
          className="mt-4 md:mt-0"
        >
          <Plus size={16} className="mr-1" /> New Note
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </motion.div>
      
      {filteredNotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No notes found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `No notes match "${searchTerm}". Try a different search term.` 
              : 'Create your first note to get started.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => startEditing({})}>
              <Plus size={16} className="mr-1" /> Create Note
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={startEditing}
                onDelete={deleteNote}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      <AnimatePresence>
        {editingNote !== null && (
          <NoteEditor
            note={editingNote}
            onSave={saveNote}
            onCancel={cancelEditing}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notes;