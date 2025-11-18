import express from "express";
import {
  addHabit,
  getHabits,
  deleteHabit,
  toggleHabit
  , updateHabit
} from "../controllers/habitController.js";

const router = express.Router();

router.post("/", addHabit);
router.get("/", getHabits);
router.delete("/:id", deleteHabit);
router.put("/:id/toggle", toggleHabit);
router.put("/:id", updateHabit);

export default router;
