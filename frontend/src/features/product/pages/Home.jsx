import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const products = useSelector((state) => state.product.products);
  const user = useSelector((state) => state.auth.user);
  const { handleGetAllProducts } = useProduct();

  const [selectedVariant, setSelectedVariant] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [showOverlayId, setShowOverlayId] = useState(null);
  const hoverTimeout = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  // 🔥 hover logic with delay (FIXED)
  const handleMouseEnter = (id) => {
    setHoveredId(id);

    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    hoverTimeout.current = setTimeout(() => {
      setShowOverlayId(id);
    }, 2000);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    setShowOverlayId(null);

    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <div className="flex items-center justify-between px-4 md:px-10 py-5 border-b border-gray-800">
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-yellow-400">
          SNITCH.
        </h1>

        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-sm">
                {user?.fullname?.charAt(0) || "U"}
              </div>
              <span className="text-sm text-gray-300 hidden sm:block">
                {user?.fullname}
              </span>
            </div>
          ) : (
            <button
              onClick={() => navigate("/register")}
              className="bg-yellow-400 text-black px-5 py-2 rounded-md font-medium hover:bg-yellow-500 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* HEADER */}
      <div className="px-4 md:px-10 py-10">
        <p className="text-yellow-400 text-xs tracking-widest mb-2">DISCOVER</p>

        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          Explore Premium Listings
        </h1>

        <p className="text-gray-400 mt-3 max-w-xl text-sm md:text-base">
          Discover curated fashion pieces from top sellers. Elevate your style
          with unique collections.
        </p>
      </div>

      {/* PRODUCT GRID */}
      <div className="px-4 md:px-10 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {products?.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -6 }}
            className="relative group rounded-xl p-[3px] overflow-hidden"
          >
            {/* 🔥 GLOW BORDER FIXED */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute inset-0 rounded-xl bg-[linear-gradient(90deg,#facc15,#a855f7,#ef4444,#facc15)] animate-border"></div>
              <div className="absolute inset-[3px] bg-black rounded-xl"></div>
            </div>

            {/* CARD */}
            <div
              className="bg-black rounded-xl overflow-hidden relative z-10 border border-gray-800 group-hover:border-yellow-400 transition"
              onClick={() => navigate(`/product/${product._id}`)}
              onMouseEnter={() => handleMouseEnter(product._id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* IMAGE */}
              <div className="w-full h-52 flex items-center justify-center bg-black overflow-hidden relative">
                <img
                  src={
                    selectedVariant[product._id]?.images?.[0]?.url ||
                    product.images?.[0]?.url
                  }
                  alt={product.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(product.images?.[0]?.url);
                  }}
                  className={`max-h-full max-w-full object-contain cursor-pointer transition-all duration-500 ${
                    showOverlayId === product._id ? "scale-105" : ""
                  }`}
                />

                {/* 🔥 OVERLAY (single, fixed) */}
                {showOverlayId === product._id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                  >
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product._id}`, {
                          state: {
                            selectedVariant:
                              selectedVariant[product._id] || null,
                          },
                        });
                      }}
                      className="bg-yellow-400 text-black px-6 py-3 rounded-md font-semibold shadow-lg hover:bg-yellow-500 transition"
                    >
                      Buy Now
                    </motion.button>
                  </motion.div>
                )}
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
                  {product.price?.currency}{" "}
                  {selectedVariant[product._id]?.price?.amount ||
                    product.price?.amount}
                </p>
                {/* VARIANT SELECTOR */}
                {product.variants?.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {product.variants.map((variant, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVariant((prev) => ({
                            ...prev,
                            [product._id]: variant,
                          }));
                        }}
                        className={`px-3 py-1 text-xs rounded-full border transition 
        ${
          selectedVariant[product._id] === variant
            ? "bg-yellow-400 text-black border-yellow-400"
            : "border-gray-600 text-gray-300 hover:border-yellow-400"
        }`}
                      >
                        {Object.values(variant.attributes || {}).join(" / ") ||
                          "Variant"}
                      </button>
                    ))}
                  </div>
                )}
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
            100% { background-position: 300% 50%; }
          }

          .animate-border {
            background-size: 300% 300%;
            animation: borderRun 4s linear infinite;
            filter: blur(2px);   
            opacity: 1;
}
        `}
      </style>
    </div>
  );
};

export default Home;
