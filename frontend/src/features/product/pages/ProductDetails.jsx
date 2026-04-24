import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { handleGetProductDetails } = useProduct();

  async function fetchProductDetails() {
    const data = await handleGetProductDetails(productId);
    setProduct(data);
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-black text-gray-900 dark:text-white px-4 md:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* 🖼 LEFT - IMAGE SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          {/* GLOW BORDER */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
            <div className="w-full h-full rounded-xl bg-[linear-gradient(90deg,#facc15,#a855f7,#ef4444,#facc15)] animate-border"></div>
          </div>

          {/* IMAGE CARD */}
          <div className="bg-white/80 dark:bg-black backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <motion.img
              src={product.images?.[0]?.url}
              alt={product.title}
              onClick={() => setPreviewImage(product.images?.[0]?.url)}
              whileHover={{ scale: 1.05 }}
              className="w-full h-[350px] md:h-[450px] object-contain cursor-pointer"
            />
          </div>
        </motion.div>

        {/* 🧾 RIGHT - DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            {product.title}
          </h1>

          {/* PRICE */}
          <p className="text-2xl font-semibold text-yellow-500">
            {product.price.currency} {product.price.amount}
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {product.description}
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {/* ADD TO CART */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gray-900 dark:bg-gray-800 text-white py-3 rounded-md hover:bg-yellow-400 hover:text-black transition"
            >
              Add to Cart
            </motion.button>

            {/* BUY NOW */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-yellow-400 text-black py-3 rounded-md font-semibold hover:bg-yellow-500 transition shadow-lg shadow-yellow-400/20"
            >
              Buy Now
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* 🖼 IMAGE MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <motion.img
            src={previewImage}
            alt="preview"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-full max-w-full rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* ✨ BORDER ANIMATION */}
      <style>
        {`
          @keyframes borderRun {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }

          .animate-border {
            background-size: 200% 200%;
            animation: borderRun 3s linear infinite;
            filter: blur(6px);
            opacity: 0.7;
          }
        `}
      </style>
    </div>
  );
};

export default ProductDetails;
