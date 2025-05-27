import { Router } from "express";
import authRouter from "./auth.routes.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import protectedRoutes from "./protected.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/protected", authMiddleware, protectedRoutes);

export default router;
