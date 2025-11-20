import express from "express";
import { addSubject, getSubjects, updateSubject, deleteSubject } from "../controllers/subjectController.js";
import { protect } from "../middleware/authMiddleware.js"; // login protected

const router = express.Router();

// Public debug endpoint (no auth) to help frontend development when auth isn't configured
router.get('/public', (req, res) => {
	return res.json([
		{ _id: 'pub1', name: 'Calculus', category: 'mathematics', rating: 2 },
		{ _id: 'pub2', name: 'Physics', category: 'science', rating: 4 },
		{ _id: 'pub3', name: 'English Literature', category: 'language', rating: 3 }
	]);
});

router.post("/", protect, addSubject);
router.get("/", protect, getSubjects);
router.put("/:id", protect, updateSubject);
router.delete("/:id", protect, deleteSubject);

export default router;
