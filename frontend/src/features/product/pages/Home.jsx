import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavCart from "../../cart/components/NavCart";
import { useProduct } from "../hooks/useProduct";
import HomeSkeleton from "../components/HomeSkeleton";

const Home = () => {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();

  const [selectedVariant, setSelectedVariant] = useState({});
  const [heroIndex, setHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const productsRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      await handleGetAllProducts();

      setLoading(false);
    };

    fetchProducts();
  }, [handleGetAllProducts]);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!products?.length) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % products.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [products]);

  const heroImage = products?.[heroIndex]?.images?.[0]?.url
    ? `${products[heroIndex].images[0].url}?tr=w-1400,q-80,f-auto`
    : "";

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="bg-white text-black min-h-screen">
      <NavCart />

      <div className="relative w-full h-[90vh] overflow-hidden">
        {heroImage && (
          <img
            key={heroImage}
            src={heroImage}
            alt="hero"
            className="absolute w-full h-full object-contain bg-gray-100 transition-opacity duration-1000"
          />
        )}

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

      <div ref={productsRef} className="px-6 md:px-20 py-20">
        <h2 className="text-center text-2xl md:text-3xl font-[Playfair_Display] tracking-wide">
          Curated Picks
        </h2>
        <p className="text-center text-gray-500 text-sm mb-16">
          Fashion fades, but style is eternal.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products?.map((product, index) => (
            <div
              key={product._id}
              className="group cursor-pointer hover:scale-105 transition duration-300"
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="relative bg-gray-100">
                <img
                  loading="lazy"
                  src={
                    (selectedVariant[product._id]?.images?.[0]?.url ||
                      product.images?.[0]?.url ||
                      "") + "?tr=w-600,q-80,f-auto"
                  }
                  alt={product.title}
                  className="w-full h-[320px] object-contain transition duration-500 group-hover:opacity-90"
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-sm font-[Poppins]">{product.title}</h3>

                <p className="text-xs text-gray-500 mt-1 font-[Inter]">
                  {product.price?.currency}{" "}
                  {selectedVariant[product._id]?.price?.amount ||
                    product.price?.amount}
                </p>
              </div>

              {product.variants?.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap justify-center">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant((prev) => ({
                          ...prev,
                          [product._id]: variant,
                        }));
                      }}
                      className={`px-2 py-1 text-xs border rounded font-[Inter] ${
                        selectedVariant[product._id]?._id === variant._id
                          ? "bg-black text-white"
                          : "hover:bg-black hover:text-white"
                      }`}
                    >
                      {Object.values(variant.attributes || {}).join(" / ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
