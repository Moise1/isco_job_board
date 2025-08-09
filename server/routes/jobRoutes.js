import express from "express";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", authMiddleware, isAdmin, createJob);
router.patch("/:id", authMiddleware, isAdmin, updateJob);
router.delete("/:id", authMiddleware, isAdmin, deleteJob);

export default router;
