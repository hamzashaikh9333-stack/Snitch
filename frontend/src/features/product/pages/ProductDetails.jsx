import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavCart from "../../cart/components/NavCart";
import useCart from "../../cart/hook/useCart";
import { useProduct } from "../hooks/useProduct";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [stockWarning, setStockWarning] = useState("");
  const [showCartPopup, setShowCartPopup] = useState(false);

  const { handleGetProductDetails } = useProduct();
  const { handleAddItem } = useCart();

  useEffect(() => {
    async function fetchData() {
      const data = await handleGetProductDetails(productId);
      setProduct(data);
      setSelectedVariantId(null);
      setSelectedImageIndex(0);
      setQuantity(1);
      setStockWarning("");
    }

    fetchData();
  }, [handleGetProductDetails, productId]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return (
      product.variants.find((variant) => variant._id === selectedVariantId) ||
      product.variants[0]
    );
  }, [product, selectedVariantId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading product...
      </div>
    );
  }

  const images =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product.images || [];

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const price = selectedVariant?.price?.amount || product.price.amount;
  const currency = selectedVariant?.price?.currency || product.price.currency;

  const resetPurchaseState = () => {
    setQuantity(1);
    setStockWarning("");
    setSelectedImageIndex(0);
  };

  const handleIncrease = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    } else {
      setStockWarning(`Only ${currentStock} items left`);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <>
      <NavCart />
      <div className="min-h-screen bg-white text-black px-6 md:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100">
              {images[selectedImageIndex]?.url && (
                <img
                  src={images[selectedImageIndex].url}
                  alt={product.title}
                  className="w-full h-[450px] object-contain cursor-pointer"
                  onClick={() => setPreviewImage(images[selectedImageIndex].url)}
                />
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img._id || img.url || i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-16 h-20 border cursor-pointer ${
                    selectedImageIndex === i ? "border-black" : "border-gray-300"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold">{product.title}</h1>

            <p className="text-xl font-medium">
              {currency} {price}
            </p>

            <p className="text-gray-600 text-sm">{product.description}</p>

            {product.variants?.length > 0 && (
              <div>
                <p className="text-sm mb-2">Select Option</p>

                <div className="flex gap-3 flex-wrap">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => {
                        setSelectedVariantId(variant._id);
                        resetPurchaseState();
                      }}
                      className={`px-4 py-1 border ${
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

            <div>
              <div className="flex items-center gap-4">
                <span>Quantity</span>

                <div className="flex border">
                  <button onClick={handleDecrease} className="px-3">
                    -
                  </button>
                  <span className="px-4">{quantity}</span>
                  <button onClick={handleIncrease} className="px-3">
                    +
                  </button>
                </div>
              </div>

              <p
                className={`font-semibold mt-4 px-3 py-1 rounded-full w-fit ${
                  currentStock > 0
                    ? "bg-green-500/10 text-green-700"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {currentStock > 0 ? `${currentStock} available` : "Out of stock"}
              </p>

              {stockWarning && (
                <p className="text-red-500 text-sm">{stockWarning}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button
                disabled={currentStock === 0}
                className={`py-3 border transition ${
                  currentStock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                    : "border-black hover:bg-black hover:text-white"
                }`}
                onClick={async () => {
                  if (currentStock === 0) return;

                  try {
                    await handleAddItem({
                      productId: product._id,
                      variantId: selectedVariant?._id || null,
                      quantity,
                    });

                    setShowCartPopup(true);
                    setQuantity(1);
                  } catch (error) {
                    console.error("Add to cart failed", error);
                  }
                }}
              >
                {currentStock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
              </button>

              <button className="bg-black text-white py-3">BUY NOW</button>
            </div>
          </div>
        </div>

        {previewImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center"
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
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 w-[90%] max-w-md relative">
              <button
                onClick={() => setShowCartPopup(false)}
                className="absolute top-2 right-2"
              >
                x
              </button>

              <p className="text-green-600 mb-4">Item added to cart</p>

              <div className="flex gap-4">
                {images[selectedImageIndex]?.url && (
                  <img
                    src={images[selectedImageIndex].url}
                    alt={product.title}
                    className="w-20 h-24 object-cover"
                  />
                )}

                <div>
                  <p>{product.title}</p>
                  <p className="text-sm text-gray-500">
                    {selectedVariant
                      ? Object.values(selectedVariant.attributes || {}).join(" / ")
                      : "Default"}
                  </p>
                  <p>
                    {currency} {price}
                  </p>
                </div>
              </div>
              <div
                onClick={() => navigate("/cart")}
                className="cursor-pointer text-[#d4af37] hover:underline"
              >
                <h1 className="text-center font-bold">View Cart</h1>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
