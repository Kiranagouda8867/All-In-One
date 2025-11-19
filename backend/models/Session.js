import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,   // ADDED subject
  startTime: String,
  duration: Number,
  reminder: String,
  completed: { type: Boolean, default: false },

  relatedNotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);
