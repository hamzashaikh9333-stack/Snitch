import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useCart from "../hook/useCart";

const getCartItem = (cartEntry) => cartEntry?.items || cartEntry;

const getProductId = (item) => {
  if (!item?.productId) return null;
  return typeof item.productId === "string" ? item.productId : item.productId._id;
};

const formatPrice = (amount) => new Intl.NumberFormat("en-IN").format(amount || 0);

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { handleGetCartItems, handleIncrementCartItem } = useCart();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    async function fetchCart() {
      try {
        setCartError("");
        await handleGetCartItems();
      } catch (error) {
        setCartError(error.response?.data?.message || "Unable to load cart");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [handleGetCartItems]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce((acc, cartEntry) => {
        const item = getCartItem(cartEntry);
        const amount = Number(item?.price?.amount || 0);
        const quantity = Number(item?.quantity || 1);
        return acc + amount * quantity;
      }, 0),
    [cartItems],
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 md:px-20 py-14">
      <div className="mb-12">
        <h1 className="text-4xl tracking-wide font-light">
          YOUR <span className="text-[#d4af37] font-semibold">CART</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Review your selected items before checkout
        </p>
      </div>

      {cartError && (
        <p className="mb-6 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {cartError}
        </p>
      )}

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {loading ? (
            <p className="text-gray-500">Loading cart...</p>
          ) : cartItems.length > 0 ? (
            cartItems.map((cartEntry) => {
              const item = getCartItem(cartEntry);
              const product = item?.productId || {};
              const productId = getProductId(item);
              const image =
                item?.variantData?.images?.[0]?.url || product?.images?.[0]?.url || "";
              const variantAttributes = item?.variantData?.attributes || {};
              const variantText =
                Object.keys(variantAttributes).length > 0
                  ? Object.values(variantAttributes).join(" / ")
                  : product?.description || "Default";
              const quantity = Number(item?.quantity || 1);
              const itemTotal = Number(item?.price?.amount || 0) * quantity;
              const key = `${item?._id || productId}-${item?.variantId || "default"}`;

              return (
                <div
                  key={key}
                  className="flex gap-6 bg-[#181818] p-5 rounded-xl border border-[#2a2a2a] hover:border-[#d4af37]/40 transition"
                >
                  <button
                    type="button"
                    onClick={() => image && setSelectedImage(image)}
                    className="w-28 h-36 shrink-0 overflow-hidden rounded-lg bg-[#222]"
                    disabled={!image}
                  >
                    {image && (
                      <img
                        src={image}
                        alt={product?.title || "Cart item"}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    )}
                  </button>

                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <h1 className="text-sm text-[#d4af37] tracking-widest">
                        {product?.title || "Product unavailable"}
                      </h1>

                      <h2 className="text-lg font-medium mt-1 tracking-wide">
                        {variantText}
                      </h2>

                      <div className="flex items-center gap-3 mt-3">
                        <button
                          className="px-3 py-1 border border-gray-600 text-gray-500 cursor-not-allowed"
                          disabled
                        >
                          -
                        </button>

                        <span className="px-3">{quantity}</span>

                        <button
                          onClick={async () => {
                            if (!productId) return;
                            await handleIncrementCartItem({
                              productId,
                              variantId: item?.variantId || null,
                            });
                          }}
                          className="px-3 py-1 border border-gray-600 hover:border-[#d4af37]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="text-lg font-semibold mt-5 text-[#d4af37]">
                      INR {formatPrice(itemTotal)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">Your cart is empty</p>
          )}

          <button
            onClick={() => navigate("/")}
            className="mt-4 border border-[#d4af37] text-[#d4af37] px-6 py-3 text-sm tracking-wide rounded-lg hover:bg-[#d4af37] hover:text-black transition"
          >
            CONTINUE SHOPPING
          </button>
        </div>

        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-8 h-fit sticky top-10">
          <h2 className="text-lg tracking-[2px] text-gray-300 mb-8 uppercase">
            The Total
          </h2>

          <div className="space-y-6 text-sm">
            <div className="flex justify-between items-center text-gray-400 tracking-wide">
              <span className="uppercase text-xs">Subtotal</span>
              <span className="text-white text-base font-medium">
                INR {formatPrice(subtotal)}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-500 text-xs tracking-wide">
              <span className="uppercase">Shipping</span>
              <span>Complimentary</span>
            </div>

            <div className="flex justify-between items-center text-gray-500 text-xs tracking-wide">
              <span className="uppercase">Duties & Taxes</span>
              <span>Included</span>
            </div>

            <div className="border-t border-[#2a2a2a] pt-6"></div>

            <div className="flex justify-between items-center">
              <span className="uppercase text-sm tracking-wide text-gray-300">
                Total
              </span>
              <span className="text-[#d4af37] text-2xl font-semibold tracking-wide">
                INR {formatPrice(subtotal)}
              </span>
            </div>
          </div>

          <button className="mt-10 w-full bg-[#d4af37] text-black py-3 text-sm tracking-[2px] uppercase rounded-md hover:opacity-90 transition">
            Proceed to Checkout
          </button>

          <p
            onClick={() => navigate("/")}
            className="mt-6 text-center text-xs tracking-[3px] text-gray-500 hover:text-white cursor-pointer uppercase"
          >
            Continue Shopping
          </p>
        </div>
      </div>

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
