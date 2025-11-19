import { useEffect, useState, useCallback, useRef } from 'react';
import { reminderOptions } from '../utils/study-session-data';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // load sessions from server, fallback to localStorage
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sessions`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const mapped = data.map(s => ({
        id: s._id || s.id,
        title: s.title,
        description: s.description,
        category: s.category || s.subject || 'lecture',
        startTime: s.startTime,
        duration: s.duration,
        reminder: s.reminder,
        completed: s.completed,
        relatedNotes: s.relatedNotes || []
      }));
      setSessions(mapped);
      setError(null);
    } catch (err) {
      setError(err);
      // fallback to localStorage
      const saved = localStorage.getItem('study-sessions');
      if (saved) {
        try { setSessions(JSON.parse(saved)); } catch(e) { console.error('parse saved sessions', e); }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Polling: fetch immediately and every 30s to keep sessions fresh
  useEffect(() => {
    let cancelled = false;
    const doFetch = async () => {
      if (cancelled) return;
      await fetchSessions();
    };
    doFetch();
    const iv = setInterval(doFetch, 30 * 1000);
    return () => { cancelled = true; clearInterval(iv); };
  }, [fetchSessions]);

  // persist sessions to localStorage whenever they change (single source of truth)
  useEffect(() => {
    try { localStorage.setItem('study-sessions', JSON.stringify(sessions)); } catch (e) { /* ignore */ }
  }, [sessions]);

  // helper to map server session to client shape
  const mapServer = (s) => ({
    id: s._id || s.id,
    title: s.title,
    description: s.description,
    category: s.category || s.subject || 'lecture',
    startTime: s.startTime,
    duration: s.duration,
    reminder: s.reminder,
    completed: s.completed,
    relatedNotes: s.relatedNotes || []
  });

  // Subscribe to Server-Sent Events for real-time updates
  useEffect(() => {
    if (typeof window === 'undefined' || !window.EventSource) return;
    let es;
    try {
      es = new EventSource(`${API_BASE}/api/sessions/stream`);
    } catch (e) {
      console.error('EventSource init failed', e);
      return;
    }

    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        if (!payload || !payload.type) return;
        if (payload.type === 'created' && payload.session) {
          const s = mapServer(payload.session);
          setSessions(prev => (prev.some(x => String(x.id) === String(s.id)) ? prev : [...prev, s]));
        } else if (payload.type === 'updated' && payload.session) {
          const s = mapServer(payload.session);
          setSessions(prev => prev.map(x => String(x.id) === String(s.id) ? s : x));
        } else if (payload.type === 'deleted' && payload.id) {
          setSessions(prev => prev.filter(x => String(x.id) !== String(payload.id)));
        }
      } catch (e) {
        console.error('SSE parse failed', e);
      }
    };

    es.onerror = (err) => {
      // EventSource will auto-reconnect; log for diagnostics
      console.warn('SSE error', err);
    };

    return () => {
      try { es.close(); } catch (e) {}
    };
  }, []);

  // timers ref for scheduled reminders
  const reminderTimers = useRef({});
  const NOTIFY_BEFORE_MINUTES = 10; // notify this many minutes before session

  // request Notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  // helper: derive minutes from session.reminder
  const getReminderMinutes = (reminder) => {
    if (!reminder) return NOTIFY_BEFORE_MINUTES;
    if (typeof reminder === 'number') return reminder;
    if (typeof reminder === 'string') {
      if (reminder.startsWith('custom:')) {
        const parts = reminder.split(':');
        const v = parseInt(parts[1], 10);
        return isNaN(v) ? NOTIFY_BEFORE_MINUTES : v;
      }
      const opt = reminderOptions.find(o => o.id === reminder);
      if (opt) return opt.minutes;
    }
    return NOTIFY_BEFORE_MINUTES;
  };

  // schedule browser notifications / timeouts for upcoming sessions
  useEffect(() => {
    // clear existing timers
    Object.values(reminderTimers.current).forEach(tid => clearTimeout(tid));
    reminderTimers.current = {};

    if (!sessions || sessions.length === 0) return;

    const now = Date.now();
    sessions.forEach(s => {
      if (!s.startTime) return;
      const st = new Date(s.startTime).getTime();
      // only schedule for future sessions that are not completed
      if (st <= now || s.completed) return;
      const minutesBefore = getReminderMinutes(s.reminder);
      const notifyAt = st - minutesBefore * 60 * 1000;
      const delay = notifyAt - now;
      if (delay <= 0) return; // too close or past

      const tid = setTimeout(() => {
        // in-page toast could be added here; use Notification API if available
        try {
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            const title = `Upcoming: ${s.title}`;
            const body = `${new Date(s.startTime).toLocaleString()} — starts in ${NOTIFY_BEFORE_MINUTES} minutes`;
            new Notification(title, { body });
          }
        } catch (e) { console.error('notify failed', e); }
      }, delay);

      reminderTimers.current[s.id] = tid;
    });

    return () => {
      Object.values(reminderTimers.current).forEach(tid => clearTimeout(tid));
      reminderTimers.current = {};
    };
  }, [sessions]);

  // create a session (server first, fallback local)
  const createSession = useCallback(async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/api/sessions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create failed');
      const saved = await res.json();
      const mapped = {
        id: saved._id || saved.id,
        title: saved.title,
        description: saved.description,
        category: saved.category || saved.subject || payload.category,
        startTime: saved.startTime,
        duration: saved.duration,
        reminder: saved.reminder,
        completed: saved.completed,
        relatedNotes: saved.relatedNotes || []
      };
      setSessions(prev => [...prev, mapped]);
      localStorage.setItem('study-sessions', JSON.stringify([...sessions, mapped]));
      return mapped;
    } catch (err) {
      // fallback: store locally with timestamp id
      const local = { id: Date.now(), ...payload };
      setSessions(prev => [...prev, local]);
      localStorage.setItem('study-sessions', JSON.stringify([...sessions, local]));
      return local;
    }
  }, [sessions]);

  const updateSession = useCallback(async (id, updates) => {
    // if id looks like server id, try server update
    const isServerId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(String(id));
    if (!isServerId) {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      localStorage.setItem('study-sessions', JSON.stringify(sessions));
      return null;
    }
    try {
      const res = await fetch(`${API_BASE}/api/sessions/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      const mapped = { id: updated._id || updated.id, title: updated.title, description: updated.description, category: updated.category || updated.subject, startTime: updated.startTime, duration: updated.duration, reminder: updated.reminder, completed: updated.completed, relatedNotes: updated.relatedNotes || [] };
      setSessions(prev => prev.map(s => s.id === id ? mapped : s));
      localStorage.setItem('study-sessions', JSON.stringify(sessions));
      return mapped;
    } catch (err) {
      console.error('[useSessions] updateSession failed', err);
      // fallback to local update
      setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      localStorage.setItem('study-sessions', JSON.stringify(sessions));
      return null;
    }
  }, [sessions]);

  const deleteSession = useCallback(async (id) => {
    const isServerId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(String(id));
    if (!isServerId) {
      setSessions(prev => prev.filter(s => s.id !== id));
      localStorage.setItem('study-sessions', JSON.stringify(sessions));
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/sessions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSessions(prev => prev.filter(s => s.id !== id));
      localStorage.setItem('study-sessions', JSON.stringify(sessions));
    } catch (err) {
      console.error('[useSessions] deleteSession failed', err);
      setSessions(prev => prev.filter(s => s.id !== id));
      localStorage.setItem('study-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const toggleCompleted = useCallback(async (id) => {
    const s = sessions.find(x => x.id === id);
    if (!s) return;
    const newCompleted = !s.completed;
    // optimistic
    setSessions(prev => prev.map(x => x.id === id ? { ...x, completed: newCompleted } : x));
    try {
      await updateSession(id, { completed: newCompleted });
    } catch (err) {
      // rollback
      setSessions(prev => prev.map(x => x.id === id ? { ...x, completed: s.completed } : x));
    }
  }, [sessions, updateSession]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
    toggleCompleted
  };
}

export default useSessions;
