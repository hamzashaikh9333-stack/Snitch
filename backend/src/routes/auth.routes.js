import { Router } from "express";
import { validateRegister } from "../validator/auth.validator.js";

const router = Router();


router.post("/register", validateRegister, );

export default router;