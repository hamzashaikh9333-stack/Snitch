import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import multer from "multer";
import {
  createProduct,
  getSellerProducts,
} from "../controllers/product.controller.js";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const productRouter = Router();

productRouter.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),
  createProductValidator,
  createProduct,
);

productRouter.get("/seller", authenticateSeller, getSellerProducts);

export default productRouter;
