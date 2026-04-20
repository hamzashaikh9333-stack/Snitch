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

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLoginUser, login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback,
);

export default router;
