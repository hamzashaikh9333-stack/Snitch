import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useAuth } from "../../auth/hook/useAuth";

const SellerDashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  async function onLogout() {
    await handleLogout();

    navigate("/login");
  }

  useEffect(() => {
    handleGetSellerProducts();
  }, [handleGetSellerProducts]);

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 lg:px-12 py-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
        <div className="flex gap-4">
          <button
            onClick={onLogout}
            className="bg-yellow-400 text-black px-6 py-3 rounded-md shadow-lg shadow-yellow-400/20
            transition-colors hover:text-red-500 text-sm font-bold"
          >
            Logout
          </button>

          <button
            onClick={() => navigate("/seller/create-product")}
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 transition hover:scale-105 active:scale-95"
          >
            + Add Product
          </button>
        </div>
      </div>

      {(!sellerProducts || sellerProducts.length === 0) && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 text-center">
          <p className="text-xl text-white font-medium">
            Start selling your first product
          </p>

          <p className="text-sm mt-2 max-w-sm">
            Build your catalog and reach more customers by adding your first
            listing.
          </p>

          <button
            onClick={() => navigate("/seller/create-product")}
            className="mt-6 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 transition hover:scale-105 active:scale-95"
          >
            Add Your First Product
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {sellerProducts?.map((product, index) => (
          <div
            key={product._id}
            className="relative group rounded-xl p-[1px] overflow-hidden transition duration-300 hover:-translate-y-1.5"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="w-full h-full rounded-xl bg-[linear-gradient(90deg,#facc15,#a855f7,#ef4444,#facc15)] animate-border"></div>
            </div>

            <div className="bg-black rounded-xl overflow-hidden relative z-10 border border-gray-800 group-hover:border-yellow-400 transition">
              <div className="w-full h-48 sm:h-52 md:h-56 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.title}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="max-h-full max-w-full object-contain cursor-pointer transition duration-500 group-hover:scale-105"
                />
              </div>

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
          </div>
        ))}
      </div>

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
