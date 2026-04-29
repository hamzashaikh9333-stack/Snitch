import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  validateAddToCart,
  validateIncrementCartItemQuantity,
} from "../validator/cart.validator.js";
import {
  addToCart,
  getCart,
  incrementCartItemQuantity,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

/* 
    cartRouter.get("/api/cart/add/:productId/:variantId",authenticateUser)
    description : add product to cart
    access : private
    arguments : productId,variantId quantity
*/

cartRouter.post(
  "/add",
  authenticateUser,
  validateAddToCart,
  addToCart
);

/*
    cartRouter.get("/api/cart",authenticateUser)
    description : get cart of user
    access : private
    route : /api/cart


*/
cartRouter.get("/", authenticateUser, getCart);

cartRouter.patch(
  "/quantity/increment/:productId",
  authenticateUser,
  validateIncrementCartItemQuantity,
  incrementCartItemQuantity,
);

export default cartRouter;
