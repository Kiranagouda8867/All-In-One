import Note from "../models/Note.js";
import path from 'path';

// Create Note
export const createNote = async (req, res) => {
  try {
    // Parse tags if sent as JSON string
    let tags = [];
    if (req.body.tags) {
      try { tags = JSON.parse(req.body.tags); } catch (e) { tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]; }
    }

    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size
    }));

    const note = await Note.create({
      userId: req.body.userId || 'guest',
      title: req.body.title,
      content: req.body.content,
      subject: req.body.subject || 'General',
      tags,
      attachments
    });

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get notes (optional filtering)
export const getNotes = async (req, res) => {
  try {
    const { subject } = req.query;

    const filter = { userId: "guest" };
    if (subject) filter.subject = subject;

    const notes = await Note.find(filter).sort({ updatedAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Note
export const updateNote = async (req, res) => {
  try {
    // Parse tags if needed
    let tags = [];
    if (req.body.tags) {
      try { tags = JSON.parse(req.body.tags); } catch (e) { tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]; }
    }

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.subject = req.body.subject || note.subject;
    note.tags = tags.length ? tags : note.tags;

    // Append any new attachments
    const newAttachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size
    }));
    if (newAttachments.length) note.attachments = [...note.attachments, ...newAttachments];

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Note
export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
