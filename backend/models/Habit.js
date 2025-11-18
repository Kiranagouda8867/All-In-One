import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  userId: {
    type: String, // you can switch to ObjectId when auth added
    required: true
  },
  name: { type: String, required: true },
  description: String,
  frequency: { type: String, default: "daily" },
  goalStreak: { type: Number, default: 21 },

  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  completedToday: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  lastCompleted: { type: Date, default: null }
});

export default mongoose.model("Habit", habitSchema);
