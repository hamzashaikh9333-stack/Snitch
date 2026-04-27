import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import useCart from "../../cart/hook/useCart";

const ProductDetails = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [stockWarning, setStockWarning] = useState("");

  const { handleGetProductDetails } = useProduct();
  const { handleAddItem } = useCart();

  const currentStock =
    product?.variants?.length > 0 ? selectedVariant?.stock : product?.stock;

  async function fetchProductDetails() {
    const data = await handleGetProductDetails(productId);
    setProduct(data);
  }

  const handleIncrease = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
      setStockWarning("");
    } else {
      setStockWarning(`Only ${currentStock} items left in stock`);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setStockWarning("");
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    setQuantity(1);
    setStockWarning("");
  }, [selectedVariant]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-[Inter]">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-16 py-10">
      <div className="flex justify-end mb-4">
        <button className="border px-4 py-2 text-sm font-[Poppins] hover:bg-black hover:text-white transition">
          🛒 Cart
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
        {/* 🔥 LEFT SIDE - IMAGE */}
        <div className="flex flex-col gap-5">
          {/* MAIN IMAGE */}
          <div className="bg-gray-100">
            <img
              src={product.images?.[selectedImageIndex]?.url}
              alt={product.title}
              onClick={() =>
                setPreviewImage(product.images?.[selectedImageIndex]?.url)
              }
              className="w-full h-[400px] md:h-[550px] object-contain cursor-pointer"
            />
          </div>

          {/* 🔥 THUMBNAILS */}
          <div className="flex gap-3 overflow-x-auto">
            {/* 🔹 PRODUCT IMAGES */}
            {product.images?.map((img, i) => (
              <div
                key={`p-${i}`}
                onClick={() => {
                  setSelectedImageIndex(i);
                }}
                className={`w-16 h-20 border cursor-pointer ${
                  selectedVariant === "default" && selectedImageIndex === i
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 RIGHT SIDE - DETAILS */}
        <div className="flex flex-col gap-6">
          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-[Playfair_Display] leading-snug">
            {product.title}
          </h1>

          {/* PRICE */}
          <p className="text-xl font-[Poppins]">
            {product.price.currency}{" "}
            {selectedVariant === "default"
              ? product.price.amount
              : selectedVariant?.price?.amount}
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-600 leading-relaxed text-sm font-[Inter] max-w-md">
            {product.description}
          </p>

          {/* VARIANTS */}
          {product.variants?.length > 0 && (
            <div>
              <p className="text-sm mb-2 font-[Inter]">Select Variant</p>

              <div className="flex gap-3 flex-wrap">
                {product.variants.map((variant, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedVariant(variant);
                    }}
                    className={`px-4 py-1 border text-sm font-[Poppins] ${
                      selectedVariant?._id === variant._id
                        ? "bg-black text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {Object.values(variant.attributes || {}).join(" / ")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-[Inter]">Quantity</span>

              <div className="flex border">
                <button onClick={handleDecrease} className="px-3 py-1">
                  -
                </button>

                <span className="px-4 py-1">{quantity}</span>

                <button onClick={handleIncrease} className="px-3 py-1">
                  +
                </button>
              </div>
            </div>

            {/* STOCK */}
            <p className="text-xs text-gray-500 font-[Inter]">
              {currentStock > 0
                ? `${currentStock} items available`
                : "Out of stock"}
            </p>

            {/* WARNING */}
            {stockWarning && (
              <p className="text-xs text-red-500 font-[Inter]">
                {stockWarning}
              </p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              disabled={currentStock === 0}
              className="w-full border border-black py-3 font-[Poppins] text-sm hover:bg-black hover:text-white transition disabled:opacity-50"
              onClick={async () => {
                const payload = {
                  productId: product._id,
                  quantity,
                };

                if (selectedVariant !== "default") {
                  payload.variantId = selectedVariant._id;
                }

                await handleAddItem(payload);
                setShowCartPopup(true);
              }}
            >
              ADD TO CART
            </button>

            <button className="w-full bg-black text-white py-3 font-[Poppins] text-sm hover:opacity-90">
              BUY IT NOW
            </button>
          </div>

          {/* EXTRA INFO */}
          <div className="grid grid-cols-3 text-center text-xs text-gray-500 pt-6 border-t font-[Inter]">
            <div>Free Delivery</div>
            <div>Easy Returns</div>
            <div>Secure Pay</div>
          </div>
        </div>
      </div>

      {/* 🔥 IMAGE MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-h-full max-w-full"
          />
        </div>
      )}
      {showCartPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-md shadow-xl relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowCartPopup(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            {/* TITLE */}
            <p className="text-sm text-green-600 mb-4 font-[Inter]">
              ✔ Item added to your cart
            </p>

            {/* PRODUCT INFO */}
            <div className="flex gap-4">
              <img
                src={product.images?.[selectedImageIndex]?.url}
                className="w-20 h-24 object-cover"
              />

              <div>
                <h3 className="text-sm font-[Poppins]">{product.title}</h3>

                <p className="text-xs text-gray-500 mt-1 font-[Inter]">
                  Size:{" "}
                  {selectedVariant === "default"
                    ? "Default"
                    : selectedVariant?.attributes?.size}
                </p>

                <p className="text-sm mt-2 font-[Poppins]">
                  {product.price.currency}{" "}
                  {selectedVariant === "default"
                    ? product.price.amount
                    : selectedVariant?.price?.amount}
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex flex-col gap-3">
              <button className="border py-2 text-sm font-[Poppins] hover:bg-black hover:text-white transition">
                VIEW CART (0)
              </button>

              <button
                onClick={() => setShowCartPopup(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
