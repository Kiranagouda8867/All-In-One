import { useState, useEffect } from "react";
import axios from "axios";

export const useHabits = () => {
  const API_URL = "http://localhost:5000/api/habits";
  const userId = "guest";

  const [habits, setHabits] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);

  // Load habits from backend
  useEffect(() => {
    axios
      .get(`${API_URL}?userId=${userId}`)
      .then((res) => setHabits(res.data))
      .catch((err) => console.error(err));
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
    try {
      // debug: log toggle attempt
      // eslint-disable-next-line no-console
      console.log('[useHabits] toggleHabitComplete called, id=', id);
      const res = await axios.put(`${API_URL}/${id}/toggle`);
      // debug: log toggle result
      // eslint-disable-next-line no-console
      console.log('[useHabits] toggleHabitComplete result:', res.data);
      setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
      return res.data;
    } catch (err) {
      console.error("Toggle habit failed", err);
      throw err;
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
    editingHabit,
    saveHabit,
    deleteHabit,
    toggleHabitComplete,
    startEditing,
    cancelEditing,
  };
};
