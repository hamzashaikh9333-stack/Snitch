import { Router } from "express";
import {
  validateRegister,
  validateLoginUser,
} from "../validator/auth.validator.js";
import {
  googleCallback,
  login,
  register,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../database/config.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLoginUser, login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      config.NODE_ENV == "development"
        ? "http://localhost:5173/login"
        : "/login",
  }),
  googleCallback,
);

export default router;
