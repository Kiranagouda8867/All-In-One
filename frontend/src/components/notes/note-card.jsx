import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/card';
import Button from '../ui/button';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Card className="h-full flex flex-col">
        <Card.Header className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-800 truncate">{note.title}</h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showActions ? 1 : 0 }}
              className="flex space-x-1"
            >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(note)}
                  className="p-1 h-8 w-8"
                >
                <Edit2 size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                  onClick={() => onDelete(note._id)}
                className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </motion.div>
          </div>
          <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
        </Card.Header>
        <Card.Content className="flex-1">
          <p className="text-gray-600 line-clamp-3">{note.content}</p>
        </Card.Content>
        <Card.Footer className="pt-2">
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          {note.attachments && note.attachments.length > 0 && (() => {
            const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const resolveUrl = (a) => {
              if (!a || !a.url) return '';
              if (a.url.startsWith('http')) return a.url;
              return `${base}${a.url}`;
            };

            return (
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Attachments:</div>
                <ul className="text-sm list-disc list-inside">
                  {note.attachments.map((a, i) => (
                    <li key={i}>
                      <a className="text-indigo-600 hover:underline" href={resolveUrl(a)} target="_blank" rel="noreferrer">
                        {a.originalName || a.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

export default NoteCard;