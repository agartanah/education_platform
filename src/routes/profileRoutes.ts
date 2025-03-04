import { Router } from "express";
import { authMiddleware } from "../middleware/authorisation";
import { getProfile, deleteProfile } from "../controllers/profileController";

const router = Router();

router.get("/profile", authMiddleware, getProfile);
router.delete("/profile", authMiddleware, deleteProfile);

export const profileRoutes = router;
