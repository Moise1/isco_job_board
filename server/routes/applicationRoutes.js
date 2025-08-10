import express from "express";
import {
  applyForJob,
  getApplicationsByJobId,
} from "../controllers/applicationController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin, isApplicant } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, isApplicant, applyForJob);
router.get("/:job_id", authMiddleware, isAdmin, getApplicationsByJobId);

export default router;
