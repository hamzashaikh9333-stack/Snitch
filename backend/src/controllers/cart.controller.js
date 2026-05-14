import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

const normalizeVariantId = (variantId) => variantId || null;

const getVariantFromProduct = (product, variantId) => {
  if (!product || !variantId) return null;
  return product.variants.find((v) => v._id.toString() === variantId.toString());
};

const buildCartResponse = (cart) => {
  const items = cart.items
    .filter((item) => item.productId)
    .map((item) => {
      const cartItem = item.toObject ? item.toObject({ flattenMaps: true }) : item;
      const variantData = getVariantFromProduct(cartItem.productId, cartItem.variantId);
      const itemPrice = cartItem.price.amount * cartItem.quantity;

      return {
        items: {
          ...cartItem,
          variantData,
        },
        itemPrice,
      };
    });

  return {
    _id: cart._id,
    userId: cart.userId,
    total: items.reduce((total, item) => total + item.itemPrice, 0),
    currency: items[0]?.items?.price?.currency || "INR",
    items,
  };
};

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  const variantId = normalizeVariantId(req.body.variantId);
  const requestedQuantity = Number(req.body.quantity);

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
    ? getVariantFromProduct(product, variantId)?.stock
    : product.stock;

  if (stock === undefined) {
    return res.status(400).json({
      message: "Stock not defined",
      success: false,
    });
  }

  let cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart) {
    cart = await cartModel.create({ userId: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      (item.variantId?.toString() || null) === (variantId?.toString() || null),
  );

  if (existingItem) {
    if (existingItem.quantity + requestedQuantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left and you already have ${existingItem.quantity}`,
        success: false,
      });
    }

    existingItem.quantity += requestedQuantity;
  } else {
    if (requestedQuantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock`,
        success: false,
      });
    }

    const price = variantId
      ? getVariantFromProduct(product, variantId)?.price
      : product.price;

    cart.items.push({
      productId,
      variantId,
      quantity: requestedQuantity,
      price,
    });
  }

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
    cart = await cartModel.create({ userId: req.user._id, items: [] });
    await cart.populate("items.productId");
  }

  res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart: buildCartResponse(cart),
  });
};

export const incrementCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const variantId = normalizeVariantId(req.body.variantId);

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

  let cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart) {
    cart = await cartModel.create({ userId: req.user._id, items: [] });
  }

  const stock = variantId
    ? await stockOfVariant(productId, variantId)
    : product.stock;

  const item = cart.items.find((item) => {
    return (
      item.productId.toString() === productId &&
      (item.variantId?.toString() || null) === (variantId?.toString() || null)
    );
  });

  const itemQuantityInCart = item?.quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left and you already have ${itemQuantityInCart}`,
      success: false,
    });
  }

  const updateResult = await cartModel.updateOne(
    {
      userId: req.user._id,
      items: {
        $elemMatch: {
          productId,
          variantId,
        },
      },
    },
    {
      $inc: { "items.$.quantity": 1 },
    },
  );

  if (updateResult.modifiedCount === 0) {
    const price = variantId
      ? getVariantFromProduct(product, variantId)?.price
      : product.price;

    await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          items: {
            productId,
            variantId,
            quantity: 1,
            price,
          },
        },
      },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      message: "New item added to cart",
      success: true,
    });
  }

  return res.status(200).json({
    message: "Cart item quantity incremented",
    success: true,
  });
};
