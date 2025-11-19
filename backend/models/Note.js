import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    subject: { type: String, required: true }, // e.g., "Physics"
    tags: { type: [String], default: [] },
    attachments: {
      type: [
        {
          filename: String,
          originalName: String,
          url: String,
          mimeType: String,
          size: Number
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
