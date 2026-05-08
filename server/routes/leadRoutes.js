import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addNote,
  getDashboardStats,
} from "../controllers/leadController.js";

const router = express.Router();

// IMPORTANT: stats route MUST be before /:id
router.get("/dashboard/stats", getDashboardStats);

// ➕ CRUD routes
router.post("/", createLead);
router.get("/", getLeads);

router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

// Notes
router.post("/:id/notes", addNote);

export default router;