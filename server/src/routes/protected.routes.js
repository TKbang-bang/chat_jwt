import { Router } from "express";
import { getAllUsers } from "../controllers/users.controller.js";

const protectedRoutes = Router();

// route to verify the access token
protectedRoutes.get("/verify", (req, res) => {
  if (!req.userID)
    return res.status(401).json({ ok: false, message: "Unauthorized" });

  return res.json({ ok: true });
});

protectedRoutes.get("/user", getAllUsers);

export default protectedRoutes;
