import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../utils/api";

export const useHabits = () => {
  const API_URL = `${API}/habits`;
  const userId = "guest";

  const [habits, setHabits] = useState([]);
  const [togglingIds, setTogglingIds] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);

  // Load habits from backend and poll periodically for near-realtime updates
  useEffect(() => {
    let cancelled = false;
    const fetchHabits = async () => {
      try {
        const res = await axios.get(`${API_URL}?userId=${userId}`);
        if (!cancelled) setHabits(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHabits();
    const iv = setInterval(fetchHabits, 30 * 1000); // poll every 30s
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  // Add or update habit
  const saveHabit = async (habit) => {
    try {
      // If habit has an _id, attempt update (editing). Otherwise create new.
      if (habit._id) {
        const res = await axios.put(`${API_URL}/${habit._id}`, habit);
        // debug: log update result
        // eslint-disable-next-line no-console
        console.log('[useHabits] updateHabit result:', res.data);
        setHabits((prev) => prev.map((h) => (h._id === habit._id ? res.data : h)));
        setEditingHabit(null);
        return res.data;
      }

      const res = await axios.post(API_URL, { ...habit, userId });
      // debug: log created habit
      // eslint-disable-next-line no-console
      console.log('[useHabits] createHabit result:', res.data);
      setHabits((prev) => [...prev, res.data]);
      setEditingHabit(null);
      return res.data;
    } catch (err) {
      console.error("Save habit failed", err);
      throw err;
    }
  };

  const deleteHabit = async (id) => {
    try {
      // debug: log delete attempt
      // eslint-disable-next-line no-console
      console.log('[useHabits] deleteHabit called, id=', id);
      await axios.delete(`${API_URL}/${id}`);
      // debug: log delete success
      // eslint-disable-next-line no-console
      console.log('[useHabits] deleteHabit success, id=', id);
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error("Delete habit failed", err);
      throw err;
    }
  };

  const toggleHabitComplete = async (id) => {
    // Optimistic update: flip completedToday and adjust streaks immediately
    // Keep a snapshot to rollback if server fails
    const prevSnapshot = habits;
    // mark as toggling
    setTogglingIds((prev) => [...prev, id]);
    setHabits((prev) => prev.map((h) => {
      if (h._id !== id) return h;
      const copy = { ...h };
      if (!copy.completedToday) {
        // marking complete
        // if lastCompleted is yesterday -> +1, else if null or not yesterday -> set to 1
        const last = copy.lastCompleted ? new Date(copy.lastCompleted) : null;
        const today = new Date();
        const isYesterday = last && (new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime() === new Date(today.getFullYear(), today.getMonth(), today.getDate()-1).getTime());
        const isSameDay = last && (new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime() === new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime());
        if (last) {
          if (isYesterday) copy.currentStreak = (copy.currentStreak || 0) + 1;
          else if (!isSameDay) copy.currentStreak = 1;
          else copy.currentStreak = (copy.currentStreak || 0) + 1; // re-mark same day
        } else {
          copy.currentStreak = 1;
        }
        copy.bestStreak = Math.max(copy.bestStreak || 0, copy.currentStreak || 0);
        copy.completedToday = true;
        copy.lastCompleted = new Date().toISOString();
      } else {
        // unmark
        copy.completedToday = false;
        copy.currentStreak = Math.max(0, (copy.currentStreak || 0) - 1);
      }
      return copy;
    }));

    try {
      // send request and reconcile with server result
      // eslint-disable-next-line no-console
      console.log('[useHabits] toggleHabitComplete called, id=', id);
      const res = await axios.put(`${API_URL}/${id}/toggle`);
      // eslint-disable-next-line no-console
      console.log('[useHabits] toggleHabitComplete result:', res.data);
      setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
      return res.data;
    } catch (err) {
      // rollback to previous snapshot on error
      console.error("Toggle habit failed, rolling back", err);
      setHabits(prevSnapshot);
      throw err;
    } finally {
      setTogglingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const startEditing = (habit) => {
    setEditingHabit(habit);
  };

  const cancelEditing = () => {
    setEditingHabit(null);
  };

  return {
    habits,
    togglingIds,
    editingHabit,
    saveHabit,
    deleteHabit,
    toggleHabitComplete,
    startEditing,
    cancelEditing,
  };
};
