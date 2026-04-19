import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const validateRegister = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("contact")
    .notEmpty()
    .withMessage("Contact number is required")
    .matches(/^\d{10}$/)
    .withMessage("Please enter a valid 10 digit contact number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullname")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name should be at least 3 characters long"),
  body("isSeller")
    .isBoolean()
    .withMessage("isSeller should be a boolean value"),
  validateRequest,
];
