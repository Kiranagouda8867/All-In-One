import Session from "../models/Session.js";
import Note from "../models/Note.js";

// Create session + auto attach notes
export const createSession = async (req, res) => {
  const { subject, title } = req.body;

  // Build a case-insensitive partial match for title/subject/tags
  const searchTerm = (title || subject || '').trim();
  let notes = [];
  if (searchTerm) {
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapeRegex(searchTerm), 'i');
    notes = await Note.find({
      $or: [
        { subject: regex },
        { title: regex },
        { tags: { $in: [regex] } }
      ]
    });
  }

  const session = await Session.create({
    ...req.body,
    relatedNotes: notes.map(n => n._id)
  });
  // broadcast created session to SSE clients if available
  try {
    req.app && req.app.locals && req.app.locals.broadcastSessions && req.app.locals.broadcastSessions({ type: 'created', session });
  } catch (e) { console.error('broadcast create failed', e); }

  res.json(session);
};

export const getSessions = async (req, res) => {
  const sessions = await Session.find().populate("relatedNotes");
  res.json(sessions);
};

export const updateSession = async (req, res) => {
  const { id } = req.params;
  try {
    const updates = req.body;
    console.log('[sessionController] updateSession', id, updates);
    const session = await Session.findByIdAndUpdate(id, updates, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    try {
      req.app && req.app.locals && req.app.locals.broadcastSessions && req.app.locals.broadcastSessions({ type: 'updated', session });
    } catch (e) { console.error('broadcast update failed', e); }
    res.json(session);
  } catch (err) {
    console.error('[sessionController] updateSession error', err);
    res.status(500).json({ message: 'Could not update session', error: err.message });
  }
};

export const deleteSession = async (req, res) => {
  const { id } = req.params;
  try {
    const session = await Session.findByIdAndDelete(id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    try {
      req.app && req.app.locals && req.app.locals.broadcastSessions && req.app.locals.broadcastSessions({ type: 'deleted', id: session._id });
    } catch (e) { console.error('broadcast delete failed', e); }
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete session', error: err.message });
  }
};
