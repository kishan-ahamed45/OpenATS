import { Router } from "express";
import { getJobById } from "../controllers/job.controller";
import { getCustomQuestions } from "../controllers/custom-question.controller";
import { applyForJob } from "../controllers/candidate.controller";

const router: Router = Router();

// Public job detail — used by the careers/apply page
router.get("/jobs/:id", getJobById);

// Public custom questions for the application form
router.get("/jobs/:jobId/questions", getCustomQuestions);

// Public application submission
router.post("/jobs/:jobId/apply", applyForJob);

export default router;
