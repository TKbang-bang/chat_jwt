import { Router } from "express";
import {
  loginValidation,
  signupValidation,
} from "../middlewares/authValidations.js";
import { login, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", signupValidation, signUp);
authRouter.post("/login", loginValidation, login);

export default authRouter;
