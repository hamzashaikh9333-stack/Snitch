import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

export const addToCart = async (req, res) => {
  const { productId, variantId, quantity } = req.body;

  // ✅ 1. Find product
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

  // ✅ 2. Get stock
  const stock = variantId
    ? product.variants.find((v) => v._id.toString() === variantId)?.stock
    : product.stock;

  if (stock === undefined) {
    return res.status(400).json({
      message: "Stock not defined",
      success: false,
    });
  }

  // ✅ 3. Get or create cart
  let cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart) {
    cart = await cartModel.create({ userId: req.user._id, items: [] });
  }

  // ✅ 4. Find existing item (ONLY ONCE)
  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      (item.variantId?.toString() || null) === (variantId || null),
  );

  // ✅ 5. If exists → update
  if (existingItem) {
    if (existingItem.quantity + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left and you already have ${existingItem.quantity}`,
        success: false,
      });
    }

    existingItem.quantity += quantity;
  } else {
    // ✅ 6. If new → validate stock
    if (quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock`,
        success: false,
      });
    }

    const price = variantId
      ? product.variants.find((v) => v._id.toString() === variantId)?.price
      : product.price;

    cart.items.push({
      productId,
      variantId: variantId || null,
      quantity,
      price,
    });
  }

  // ✅ 7. Save cart
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
    cart = await cartModel.create({ userId: req.user._id });
  }

  // 🔥 ADD THIS BLOCK
  const updatedItems = cart.items.map((item) => {
    let variantData = null;

    if (item.variantId) {
      variantData = item.productId.variants.find(
        (v) => v._id.toString() === item.variantId.toString(),
      );
    }

    return {
      ...item._doc,
      variantData, // ✅ attach full variant
    };
  });

  cart = {
    ...cart._doc,
    items: updatedItems,
  };

  res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};

export const incrementCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { variantId } = req.body;

  // ✅ 1. Find product
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

  // ✅ 2. Get cart
  const cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  // ✅ 3. Get stock
  const stock = variantId
    ? await stockOfVariant(productId, variantId)
    : product.stock;

  // ✅ 4. Find item in cart
  const item = cart.items.find((item) => {
    if (variantId) {
      return (
        item.productId.toString() === productId &&
        item.variantId?.toString() === variantId
      );
    } else {
      return (
        item.productId.toString() === productId &&
        (item.variantId === null || item.variantId === undefined)
      );
    }
  });

  const itemQuantityInCart = item?.quantity || 0;

  // ✅ 5. Stock check
  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left and you already have ${itemQuantityInCart}`,
      success: false,
    });
  }

  // ✅ 6. Try increment
  const updateResult = await cartModel.updateOne(
    {
      userId: req.user._id,
      "items.productId": productId,
      ...(variantId
        ? { "items.variantId": variantId }
        : { "items.variantId": null }),
    },
    {
      $inc: { "items.$.quantity": 1 },
    },
  );

  // ✅ 7. If not found → create new item
  if (updateResult.modifiedCount === 0) {
    let price;

    if (variantId) {
      const variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(404).json({
          message: "Variant not found",
          success: false,
        });
      }
      price = variant.price;
    } else {
      price = product.price;
    }

    await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          items: {
            productId,
            variantId: variantId || null,
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

  // ✅ 8. If increment worked
  return res.status(200).json({
    message: "Cart item quantity incremented",
    success: true,
  });
};
