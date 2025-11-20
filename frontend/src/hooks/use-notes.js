import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../utils/api";

export const useNotes = () => {
  const API_URL = `${API}/notes`;
  const userId = "guest";

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  // Load notes from backend
  // Load notes from backend and poll periodically for near-realtime updates
  useEffect(() => {
    let cancelled = false;
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${API_URL}?userId=${userId}`);
        if (!cancelled) {
          setNotes(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotes();
    const iv = setInterval(fetchNotes, 30 * 1000); // poll every 30s
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  // Save note: create or update depending on presence of _id
  const saveNote = async (noteData) => {
    try {
      // If files are present, send as multipart/form-data
      const hasFiles = noteData.files && noteData.files.length;

      if (noteData._id) {
        if (hasFiles) {
          const form = new FormData();
          form.append('title', noteData.title || '');
          form.append('content', noteData.content || '');
          form.append('subject', noteData.subject || 'General');
          form.append('userId', userId);
          form.append('tags', JSON.stringify(noteData.tags || []));
          noteData.files.forEach((f) => form.append('files', f));
          const res = await axios.put(`${API_URL}/${noteData._id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
          setNotes((prev) => prev.map((n) => (n._id === noteData._id ? res.data : n)));
          setEditingNote(null);
          return res.data;
        }

        const res = await axios.put(`${API_URL}/${noteData._id}`, noteData);
        setNotes((prev) => prev.map((n) => (n._id === noteData._id ? res.data : n)));
        setEditingNote(null);
        return res.data;
      }

      if (hasFiles) {
        const form = new FormData();
        form.append('title', noteData.title || '');
        form.append('content', noteData.content || '');
        form.append('subject', noteData.subject || 'General');
        form.append('userId', userId);
        form.append('tags', JSON.stringify(noteData.tags || []));
        noteData.files.forEach((f) => form.append('files', f));
        const res = await axios.post(API_URL, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        setNotes((prev) => [res.data, ...prev]);
        setEditingNote(null);
        return res.data;
      }

      const res = await axios.post(API_URL, { ...noteData, userId, subject: noteData.subject || 'General' });
      setNotes((prev) => [res.data, ...prev]);
      setEditingNote(null);
      return res.data;
    } catch (err) {
      console.error('Save note failed', err);
      throw err;
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error('Delete note failed', err);
      throw err;
    }
  };

  const startEditing = (note) => {
    // If called with an empty object, open editor for creating a new note
    if (!note || Object.keys(note).length === 0) {
      setEditingNote(null); // NoteEditor treats null as create (it clears fields)
      // set to empty non-null marker to open modal in pages (pages call startEditing({}) )
      // We'll use an explicit marker object
      setEditingNote({ __isNew: true });
      return;
    }
    setEditingNote(note);
  };

  const cancelEditing = () => {
    setEditingNote(null);
  };

  return { notes, loading, editingNote, saveNote, deleteNote, startEditing, cancelEditing };
};
