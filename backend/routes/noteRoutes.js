import express from "express";
import multer from 'multer';
import path from 'path';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote
} from "../controllers/noteController.js";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now().toString(16) + '-' + Math.random().toString(16).slice(2);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

router.post("/", upload.array('files'), createNote);
router.get("/", getNotes);
router.put("/:id", upload.array('files'), updateNote);
router.delete("/:id", deleteNote);

export default router;
