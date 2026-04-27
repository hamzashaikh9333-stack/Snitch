import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;

  let product;

  if (variantId) {
    product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });
  } else {
    product = await productModel.findById(productId);
  }

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const stock = variantId
    ? product.variants.find((v) => v._id.toString() === variantId)?.stock
    : product.stock;

  if (stock === undefined) {
    return res.status(400).json({
      message: "Stock not defined",
      success: false,
    });
  }

  const cart =
    (await cartModel.findOne({ userId: req.user._id })) ||
    (await cartModel.create({ userId: req.user._id }));

  const isProductAlreadyInCart = cart.items.some(
    (item) =>
      item.productId.toString() === productId &&
      (item.variantId?.toString() || null) === (variantId || null),
  );

  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        (item.variantId?.toString() || null) === (variantId || null),
    ).quantity;
    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock and you already have ${quantityInCart} in your cart`,
        success: false,
      });
    }
    await cartModel.findOneAndUpdate(
      {
        userId: req.user._id,
        "items.productId": productId,
        "items.variantId": variantId,
      },
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    );
    return res.status(200).json({
      message: "Cart updated successfully",
      success: true,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock`,
      success: false,
    });
  }
  cart.items.push({
    productId,
    variantId: variantId || null,
    quantity,
    price: variantId
      ? product.variants.find((v) => v._id.toString() === variantId).price
      : product.price,
  });
  await cart.save();
  return res.status(200).json({
    message: "Cart updated successfully",
    success: true,
  });
};

export const getCart = async (req, res) => {
  let cart = await cartModel
    .findOne({ userId: req.user._id })
    .populate("items.productId");

  if (!cart) {
    cart = await cartModel.create({ user: req.user._id });
  }

  res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};
