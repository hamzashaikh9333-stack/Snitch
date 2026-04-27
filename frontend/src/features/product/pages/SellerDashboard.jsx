import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);

  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 lg:px-12 py-8">
      {/* HEADER + CTA */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* LEFT */}
        <div>
          <p className="text-yellow-400 text-xs tracking-widest mb-2">
            DASHBOARD
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold">
            Product Listings
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Manage your catalog, pricing, and inventory seamlessly
          </p>

          <div className="w-20 h-[2px] bg-yellow-400 mt-4"></div>
        </div>

        {/* RIGHT BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/seller/create-product")}
          className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 transition"
        >
          + Add Product
        </motion.button>
      </div>

      {/* EMPTY STATE */}
      {(!sellerProducts || sellerProducts.length === 0) && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 text-center">
          <p className="text-xl text-white font-medium">
            Start selling your first product
          </p>

          <p className="text-sm mt-2 max-w-sm">
            Build your catalog and reach more customers by adding your first
            listing.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/seller/create-product")}
            className="mt-6 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 transition"
          >
            Add Your First Product
          </motion.button>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {sellerProducts?.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -6 }}
            className="relative group rounded-xl p-[1px] overflow-hidden"
          >
            {/* GLOW BORDER */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="w-full h-full rounded-xl bg-[linear-gradient(90deg,#facc15,#a855f7,#ef4444,#facc15)] animate-border"></div>
            </div>

            {/* CARD */}
            <div className="bg-black rounded-xl overflow-hidden relative z-10 border border-gray-800 group-hover:border-yellow-400 transition">
              {/* IMAGE */}
              <div className="w-full h-48 sm:h-52 md:h-56 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.title}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="max-h-full max-w-full object-contain cursor-pointer transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-base md:text-lg font-medium truncate">
                  {product.title}
                </h2>

                <p className="text-sm text-gray-400 line-clamp-2">
                  {product.description}
                </p>

                <p className="text-yellow-400 font-semibold mt-2">
                  {product.price?.currency} {product.price?.amount}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/seller/product/${product._id}`)}
                    className="flex-1 text-xs md:text-sm bg-gray-800 hover:bg-yellow-400 hover:text-black py-2 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button className="flex-1 text-xs md:text-sm bg-gray-800 hover:bg-red-500 py-2 rounded-md transition">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* IMAGE MODAL */}
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

      {/* BORDER ANIMATION */}
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

export default SellerDashboard;
