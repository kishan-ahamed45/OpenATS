import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
} from "../controllers/user.controller";

const router:Router = Router();

router.get("/", getAllUsers);
router.get("/me", getCurrentUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);

export default router;
