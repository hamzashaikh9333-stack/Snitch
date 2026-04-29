import {param ,body,validationResult} from "express-validator";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateAddToCart = [
  body("productId").isMongoId().withMessage("Invalid product id"),
  body("variantId")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid variant id"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  validateRequest,
];

export const validateIncrementCartItemQuantity = [
  param("productId").isMongoId().withMessage("Invalid product id"),
  param("variantId").optional({ checkFalsy: true }).isMongoId().withMessage("Invalid variant id"),
  validateRequest,
]