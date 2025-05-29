import { Router } from "express";
import {
  getAllUsers,
  getUserMessages,
} from "../controllers/users.controller.js";
import {
  createGroup,
  getGroupMessages,
} from "../controllers/groups.controller.js";

const protectedRoutes = Router();

// route to verify the access token
protectedRoutes.get("/verify", (req, res) => {
  if (!req.userID)
    return res.status(401).json({ ok: false, message: "Unauthorized" });

  return res.json({ ok: true, accessToken: req.accessToken });
});

protectedRoutes.get("/user", getAllUsers);
protectedRoutes.get("/user/:userId", getUserMessages);
protectedRoutes.get("/group/:groupId", getGroupMessages);
protectedRoutes.post("/creategroup", createGroup);

export default protectedRoutes;
