import { Router } from "express";
import multer from "multer";
import { getJobById } from "../controllers/job.controller";
import { getCustomQuestions } from "../controllers/custom-question.controller";
import { applyForJob } from "../controllers/candidate.controller";
import { uploadFile } from "../controllers/upload.controller";

const router: Router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/jobs/:id", getJobById);

router.get("/jobs/:jobId/questions", getCustomQuestions);

router.post("/jobs/:jobId/apply", applyForJob);

router.post("/upload/resume", upload.single("file"), uploadFile);

export default router;
