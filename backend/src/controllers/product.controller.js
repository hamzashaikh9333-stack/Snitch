import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
  const { title, description, priceAmount, priceCurrency, stock, size } =
    req.body;

  const sizesArray = size ? size.split(",").map((s) => s.trim()) : [];
  const productStock = Number(stock || 10);
  const productPrice = Number(priceAmount);

  const seller = req.user;

  const images = await Promise.all(
    (req.files || []).map(async (file) => {
      return await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
    }),
  );

  // 🔥 CREATE VARIANTS FROM SIZES
  const variants = sizesArray.map((s) => ({
    attributes: { size: s },
    stock: productStock,
    price: {
      amount: productPrice,
      currency: priceCurrency || "INR",
    },
  }));

  const product = await productModel.create({
    title,
    description,
    price: {
      amount: productPrice,
      currency: priceCurrency || "INR",
    },
    images,
    seller: seller._id,
    stock: variants.length > 0 ? 0 : productStock,
    variants,
  });

  res.status(201).json({
    message: "Product created successfully",
    success: true,
    product,
  });
}
export async function getSellerProducts(req, res) {
  const seller = req.user;
  const products = await productModel.find({ seller: seller._id });
  res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
}

export async function getAllProducts(req, res) {
  const products = await productModel.find();
  res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
}

export async function getProductDetails(req, res) {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }
  return res.status(200).json({
    message: "Product fetched successfully",
    success: true,
    product,
  });
}

export async function addProductVariant(req, res) {
  const productId = req.params.productId;
  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  const files = req.files;
  const images = [];
  if (files && files.length !== 0) {
    (
      await Promise.all(
        files.map(async (file) => {
          const image = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
          return image;
        }),
      )
    ).map((image) => {
      images.push(image);
    });
  }

  let price;

  if (req.body.priceAmount && req.body.priceAmount !== "undefined") {
    price = Number(req.body.priceAmount);
  } else {
    price = product.price.amount;
  }
  const stock = Number(req.body.stock || 0);
  const attributes = JSON.parse(req.body.attributes || "{}");

  product.variants.push({
    images,
    price: {
      amount: price || product.price.amount,
      currency: req.body.priceCurrency || product.price.currency,
    },
    stock,
    attributes,
  });

  await product.save();
  return res.status(200).json({
    message: "Product variant added successfully",
    success: true,
    product,
  });
}
