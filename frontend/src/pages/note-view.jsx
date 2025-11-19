import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import { useNotes } from '../hooks/use-notes';
import { ArrowLeft } from 'lucide-react';

const NoteView = () => {
  const { id } = useParams();
  const { notes } = useNotes();

  const note = notes.find(n => n._id === id || n.id === id);

  if (!note) return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <Card.Content className="py-12 text-center">
          <p className="text-gray-600">Note not found.</p>
          <Link to="/notes"><Button className="mt-4"><ArrowLeft size={16} className="mr-2" />Back to Notes</Button></Link>
        </Card.Content>
      </Card>
    </div>
  );

  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const resolveUrl = (a) => {
    if (!a || !a.url) return '';
    if (a.url.startsWith('http')) return a.url;
    return `${base}${a.url}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/notes"><Button variant="ghost"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
      </div>
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold">{note.title}</h2>
          <p className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleString()}</p>
        </Card.Header>
        <Card.Content>
          <div className="prose max-w-none">
            <p>{note.content}</p>
          </div>
        </Card.Content>
        {note.attachments && note.attachments.length > 0 && (
          <Card.Footer>
            <div className="text-sm text-gray-700">Attachments</div>
            <ul className="list-disc list-inside">
              {note.attachments.map((a, i) => (
                <li key={i}><a href={resolveUrl(a)} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{a.originalName || a.filename}</a></li>
              ))}
            </ul>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default NoteView;
