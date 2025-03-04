import { Router } from "express";
import { getStudents } from "../controllers/studentController";

const router = Router();

router.get("/", getStudents);

export const studentRoutes = router;
