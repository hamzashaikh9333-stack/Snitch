import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

/* 
    cartRouter.get("/api/cart/add/:productId/:variantId",authenticateUser)
    description : add product to cart
    access : private
    arguments : productId,variantId quantity
*/

// WITHOUT variant
cartRouter.post(
  "/add/:productId",
  authenticateUser,
  validateAddToCart,
  addToCart,
);

// WITH variant
cartRouter.post(
  "/add/:productId/:variantId",
  authenticateUser,
  validateAddToCart,
  addToCart,
);

/*
    cartRouter.get("/api/cart",authenticateUser)
    description : get cart of user
    access : private
    route : /api/cart


*/
cartRouter.get("/", authenticateUser, getCart);

export default cartRouter;
