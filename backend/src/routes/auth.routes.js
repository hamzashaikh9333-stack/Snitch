import { Router } from "express";
import {
  validateRegister,
  validateLoginUser,
} from "../validator/auth.validator.js";
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLoginUser, login);

export default router;
