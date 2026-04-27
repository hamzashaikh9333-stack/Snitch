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

  const [heroIndex, setHeroIndex] = useState(0);

  const hoverTimeout = useRef(null);
  const navigate = useNavigate();
  const productsRef = useRef(null);

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 🔥 HERO AUTO SLIDER
  useEffect(() => {
    if (!products?.length) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % products.length);
    }, 1000); // ⚠️ you can change to 2500 for better UX

    return () => clearInterval(interval);
  }, [products]);

  const heroImage = products?.[heroIndex]?.images?.[0]?.url || "";

  // 🔥 HOVER LOGIC
  const handleMouseEnter = (id) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setShowOverlayId(id);
    }, 1200);
  };

  const handleMouseLeave = () => {
    setShowOverlayId(null);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* 🔥 NAVBAR */}
      <div className="flex items-center justify-between px-6 md:px-16 py-6 border-b">
        <h1 className="text-xl md:text-2xl tracking-widest font-semibold font-[Playfair_Display]">
          SNITCH
        </h1>

        <div>
          {user ? (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-[Inter]">
              {user?.fullname?.charAt(0) || "U"}
            </div>
          ) : (
            <button
              onClick={() => navigate("/register")}
              className="border px-5 py-2 text-sm font-[Poppins] hover:bg-black hover:text-white transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* 🔥 HERO SLIDER */}
      <div className="relative w-full h-[90vh] overflow-hidden">
        <img
          key={heroImage}
          src={heroImage}
          alt="hero"
          className="absolute w-full h-full object-contain bg-gray-100 transition-opacity duration-1000"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-xs tracking-[4px] mb-3 font-[Inter]">
            NEW COLLECTION
          </p>

          <h1 className="text-4xl md:text-6xl font-[Playfair_Display]">
            The Style Edits
          </h1>

          <button
            onClick={scrollToProducts}
            className="mt-6 px-8 py-3 border border-white text-sm tracking-widest font-[Poppins] hover:bg-white hover:text-black transition"
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* 🔥 CURATED PICKS */}
      <div ref={productsRef} className="px-6 md:px-20 py-20">
        <h2 className="text-center text-2xl md:text-3xl font-[Playfair_Display] tracking-wide">
          Curated Picks 
        </h2>
          <p className="text-center text-gray-500 text-sm mb-16">“Fashion fades, but style is eternal.”</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products?.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer hover:scale-105 transition duration-300"
              onClick={() => navigate(`/product/${product._id}`)}
              onMouseEnter={() => handleMouseEnter(product._id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* IMAGE */}
              <div className="relative bg-gray-100">
                <img
                  src={
                    selectedVariant[product._id]?.images?.[0]?.url ||
                    product.images?.[0]?.url
                  }
                  alt={product.title}
                  className="w-full h-[320px] object-contain transition duration-500 group-hover:opacity-90"
                />
              </div>

              {/* TEXT */}
              <div className="mt-4 text-center">
                <h3 className="text-sm font-[Poppins]">{product.title}</h3>

                <p className="text-xs text-gray-500 mt-1 font-[Inter]">
                  {product.price?.currency}{" "}
                  {selectedVariant[product._id]?.price?.amount ||
                    product.price?.amount}
                </p>
              </div>

              {/* VARIANTS */}
              {product.variants?.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap justify-center">
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
                      className={`px-2 py-1 text-xs border rounded font-[Inter]
                      ${
                        selectedVariant[product._id] === variant
                          ? "bg-black text-white"
                          : "hover:bg-black hover:text-white"
                      }`}
                    >
                      {Object.values(variant.attributes || {}).join(" / ")}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔥 IMAGE MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-h-full max-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Home;
