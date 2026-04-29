import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useCart from "../hook/useCart";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { handleGetCartItems, handleIncrementCartItem } = useCart();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    handleGetCartItems();
  }, []);

  // ✅ TOTAL PRICE
  const subtotal = cartItems?.reduce(
    (acc, item) => acc + item.price.amount * (item.quantity || 1),
    0,
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 md:px-20 py-14">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl tracking-wide font-light">
          YOUR <span className="text-[#d4af37] font-semibold">CART</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Review your selected items before checkout
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {cartItems?.length > 0 ? (
            cartItems.map((item) => {
              // ✅ CORRECT IMAGE
              const image =
                item.variantData?.images?.[0]?.url ||
                item.productId?.images?.[0]?.url;

              // ✅ CORRECT TEXT
              const variantText = item.variantData?.attributes
                ? Object.values(item.variantData.attributes).join(" / ")
                : item.productId?.description;

              // ✅ ITEM TOTAL
              const itemTotal = item.price.amount * (item.quantity || 1);

              return (
                <div
                  key={item._id}
                  className="flex gap-6 bg-[#181818] p-5 rounded-xl border border-[#2a2a2a] hover:border-[#d4af37]/40 transition"
                >
                  {/* IMAGE */}
                  <img
                    src={image || null}
                    alt={item.productId?.title}
                    onClick={() => setSelectedImage(image)}
                    className="w-28 h-36 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                  />

                  {/* DETAILS */}
                  <div className="flex flex-col justify-between w-full">
                    <div>
                      {/* PRODUCT NAME */}
                      <h1 className="text-sm text-[#d4af37] tracking-widest">
                        {item.productId?.title}
                      </h1>

                      {/* VARIANT / DESCRIPTION */}
                      <h2 className="text-lg font-medium mt-1 tracking-wide">
                        {variantText}
                      </h2>

                      {/* QUANTITY */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          className="px-3 py-1 border border-gray-600 hover:border-[#d4af37]"
                          // later: add decrement API here
                        >
                          -
                        </button>

                        <span className="px-3">{item.quantity || 1}</span>

                        <button
                          onClick={async () => {
                            await handleIncrementCartItem({
                              productId: item.productId._id,
                              variantId: item.variantId || null,
                            });

                            // ✅ refresh cart after update
                            handleGetCartItems();
                          }}
                          className="px-3 py-1 border border-gray-600 hover:border-[#d4af37]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* PRICE */}
                    <p className="text-lg font-semibold mt-5 text-[#d4af37]">
                      ₹ {itemTotal}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">Your cart is empty</p>
          )}

          {/* CONTINUE SHOPPING */}
          <button
            onClick={() => navigate("/")}
            className="mt-4 border border-[#d4af37] text-[#d4af37] px-6 py-3 text-sm tracking-wide rounded-lg hover:bg-[#d4af37] hover:text-black transition"
          >
            CONTINUE SHOPPING
          </button>
        </div>

        {/* RIGHT */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-8 h-fit sticky top-10">
          {/* TITLE */}
          <h2 className="text-lg tracking-[2px] text-gray-300 mb-8 uppercase">
            The Total
          </h2>

          {/* DETAILS */}
          <div className="space-y-6 text-sm">
            {/* SUBTOTAL */}
            <div className="flex justify-between items-center text-gray-400 tracking-wide">
              <span className="uppercase text-xs">Subtotal</span>
              <span className="text-white text-base font-medium">
                INR {subtotal}
              </span>
            </div>

            {/* SHIPPING */}
            <div className="flex justify-between items-center text-gray-500 text-xs tracking-wide">
              <span className="uppercase">Shipping</span>
              <span>Complimentary</span>
            </div>

            {/* TAX */}
            <div className="flex justify-between items-center text-gray-500 text-xs tracking-wide">
              <span className="uppercase">Duties & Taxes</span>
              <span>Included</span>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-[#2a2a2a] pt-6"></div>

            {/* TOTAL */}
            <div className="flex justify-between items-center">
              <span className="uppercase text-sm tracking-wide text-gray-300">
                Total
              </span>
              <span className="text-[#d4af37] text-2xl font-semibold tracking-wide">
                INR {subtotal}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button className="mt-10 w-full bg-[#d4af37] text-black py-3 text-sm tracking-[2px] uppercase rounded-md hover:opacity-90 transition">
            Proceed to Checkout
          </button>

          {/* CONTINUE */}
          <p
            onClick={() => navigate("/")}
            className="mt-6 text-center text-xs tracking-[3px] text-gray-500 hover:text-white cursor-pointer uppercase"
          >
            Continue Shopping
          </p>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="preview"
            className="max-w-[90%] max-h-[90%] rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
