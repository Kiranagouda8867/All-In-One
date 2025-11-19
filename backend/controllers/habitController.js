import Habit from "../models/Habit.js";
import mongoose from "mongoose";

// In-memory fallback store for development when MongoDB isn't reachable
let inMemoryHabits = [];
const genId = () => (Date.now().toString(16) + Math.random().toString(16).slice(2));

const usingDb = () => mongoose.connection && mongoose.connection.readyState === 1;

// Helper: Check streak logic
const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isYesterday = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

// Add habit
export const addHabit = async (req, res) => {
  try {
    // Debug: log active DB name to help diagnose Atlas namespace issues
    // eslint-disable-next-line no-console
    console.log('[habits] active DB:', mongoose.connection && mongoose.connection.name);
    const payload = {
      userId: req.body.userId || "guest",
      name: req.body.name,
      description: req.body.description,
      frequency: req.body.frequency || 'daily',
      goalStreak: req.body.goalStreak || 21,
      currentStreak: req.body.currentStreak || 0,
      bestStreak: req.body.bestStreak || 0,
      completedToday: req.body.completedToday || false,
      lastCompleted: req.body.lastCompleted || null,
      createdAt: req.body.createdAt || Date.now()
    };

    if (usingDb()) {
      const habit = await Habit.create(payload);
      return res.json(habit);
    }

    // Fallback to in-memory store
    const habit = { ...payload, _id: genId() };
    inMemoryHabits.push(habit);
    return res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all habits
export const getHabits = async (req, res) => {
  const userId = req.query.userId || "guest";
  if (usingDb()) {
    const habits = await Habit.find({ userId });
    return res.json(habits);
  }

  // Return from in-memory
  return res.json(inMemoryHabits.filter(h => h.userId === userId));
};

// Delete habit
export const deleteHabit = async (req, res) => {
  const id = req.params.id;
  if (usingDb()) {
    await Habit.findByIdAndDelete(id);
    return res.json({ message: "Habit deleted" });
  }

  inMemoryHabits = inMemoryHabits.filter(h => h._id !== id);
  return res.json({ message: "Habit deleted (in-memory)" });
};

// Toggle complete
export const toggleHabit = async (req, res) => {
  try {
    const id = req.params.id;
    let habit;
    if (usingDb()) {
      habit = await Habit.findById(id);
      if (!habit) return res.status(404).json({ error: "Habit not found" });
    } else {
      habit = inMemoryHabits.find(h => h._id === id);
      if (!habit) return res.status(404).json({ error: "Habit not found (in-memory)" });
    }

    const today = new Date();

    if (!habit.completedToday) {
      // Mark as completed
      if (habit.lastCompleted) {
        const last = new Date(habit.lastCompleted);
        if (isYesterday(last)) {
          habit.currentStreak += 1;
        } else if (!isSameDay(last, today)) {
          habit.currentStreak = 1;
        } else {
          // lastCompleted is same day (user previously marked today then undone)
          // Re-marking should restore/increment the streak by 1
          habit.currentStreak += 1;
        }
      } else {
        habit.currentStreak = 1;
      }

      habit.bestStreak = Math.max(habit.bestStreak, habit.currentStreak);
      habit.completedToday = true;
      habit.lastCompleted = today;
    } else {
      // Unmark as completed
      habit.completedToday = false;
      habit.currentStreak = Math.max(0, habit.currentStreak - 1);
    }

    if (usingDb()) {
      await habit.save();
      res.json(habit);
    } else {
      // replace entry in inMemoryHabits
      inMemoryHabits = inMemoryHabits.map(h => (h._id === habit._id ? habit : h));
      res.json(habit);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update habit (basic fields)
export const updateHabit = async (req, res) => {
  try {
    const updates = req.body;
    const id = req.params.id;
    if (usingDb()) {
      const habit = await Habit.findByIdAndUpdate(id, updates, { new: true });
      if (!habit) return res.status(404).json({ error: 'Habit not found' });
      return res.json(habit);
    }

    const idx = inMemoryHabits.findIndex(h => h._id === id);
    if (idx === -1) return res.status(404).json({ error: 'Habit not found (in-memory)' });
    inMemoryHabits[idx] = { ...inMemoryHabits[idx], ...updates };
    return res.json(inMemoryHabits[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
