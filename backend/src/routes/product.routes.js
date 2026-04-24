import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import multer from "multer";
import {
  addProductVariant,
  createProduct,
  getAllProducts,
  getProductDetails,
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

productRouter.get("/", getAllProducts);

productRouter.get("/detail/:id", getProductDetails);

//*@route post /api/products/:productId/variants
//*@desc add variants to a product
//* @access seller

productRouter.post(
  "/:productId/variants",
  authenticateSeller,
  upload.array("images", 7),
  createProductValidator,addProductVariant
);

export default productRouter;
