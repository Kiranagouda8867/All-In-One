import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/card';
import Button from '../ui/button';
import Input from '../ui/input';
import { X, Save, Tag } from 'lucide-react';

const NoteEditor = ({ 
  note = null, 
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    const noteData = {
      id: note ? note.id : Date.now(),
      title: title.trim(),
      content: content.trim(),
      tags,
      createdAt: note ? note.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(noteData);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <Card.Header className="flex justify-between items-center pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="p-1 h-8 w-8"
          >
            <X size={20} />
          </Button>
        </Card.Header>
        
        <Card.Content className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm"
                  >
                    <span>{tag}</span>
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-indigo-600 hover:text-indigo-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddTag} className="flex">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  variant="outline" 
                  size="sm"
                  className="ml-2"
                >
                  <Tag size={16} />
                </Button>
              </form>
            </div>
          </div>
        </Card.Content>
        
        <Card.Footer className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save size={16} className="mr-1" /> Save Note
          </Button>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

export default NoteEditor;