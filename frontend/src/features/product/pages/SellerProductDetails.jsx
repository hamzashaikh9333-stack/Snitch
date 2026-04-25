import React, { useState, useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SellerProductDetails = () => {
  const { handleGetProductDetails, handleGetSellerProducts } = useProduct();
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    async function fetchData() {
      const data = await handleGetProductDetails(productId);
      const finalData = data?.product || data;

      setProduct(finalData);
      setSelectedImage(finalData?.images?.[0]?.url || null);
      setVariants(finalData?.variants || []);

      const sellerData = await handleGetSellerProducts();
      setProducts(sellerData?.products || sellerData || []);
    }

    fetchData();
  }, [productId]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      setProduct((prev) => ({
        ...prev,
        price: { ...prev.price, amount: value },
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 7) {
      alert("Maximum 7 images allowed");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages];

      // if no image selected yet → auto select first uploaded
      if (!selectedImage && updated.length > 0) {
        setSelectedImage(updated[0].preview);
      }

      return updated;
    });
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      // if deleted image was selected → update preview
      if (selectedImage === prev[index]?.preview) {
        if (updated.length > 0) {
          setSelectedImage(updated[0].preview);
        } else {
          // fallback to original product image
          setSelectedImage(product?.images?.[0]?.url || null);
        }
      }

      return updated;
    });
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { stock: 0, attributes: {}, price: { amount: "", currency: "INR" } },
    ]);
  };

  const removeVariant = (i) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateVariant = (i, field, value) => {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  };

  // ================= UI =================
  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <div className="w-72 border-r border-gray-800 bg-black flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <p className="text-yellow-400 text-xs tracking-widest">INVENTORY</p>
          <h2 className="text-lg font-semibold mt-1">Products</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {products.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/seller/product/${item._id}`)}
              className={`p-3 rounded-lg cursor-pointer border transition ${
                item._id === productId
                  ? "border-yellow-400 bg-[#111827]"
                  : "border-gray-800 hover:border-gray-600 hover:bg-[#0f172a]"
              }`}
            >
              <div className="flex gap-3 items-center">
                <img
                  src={item.images?.[0]?.url}
                  alt=""
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div>
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">
                    {item.price?.amount} {item.price?.currency}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">{product.title}</h1>
            <p className="text-xs text-gray-400">Edit product details</p>
          </div>

          <button className="bg-yellow-400 text-black px-5 py-2 rounded-md font-semibold hover:bg-yellow-500 transition">
            Save
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 grid lg:grid-cols-2 gap-8">
          {/* LEFT - PREVIEW */}
          {/* LEFT - IMAGE MANAGER */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black rounded-xl p-6 border border-gray-800 flex flex-col gap-5"
          >
            {/* MAIN IMAGE */}
            <div className="flex items-center justify-center h-[300px] bg-[#0f172a] rounded-lg">
              <img
                src={selectedImage ? selectedImage : product.images?.[0]?.url}
                alt=""
                className="max-h-full object-contain"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-4 gap-3">
              {/* ✅ ORIGINAL PRODUCT IMAGE */}
              {product.images?.[0]?.url && (
                <div
                  onClick={() => setSelectedImage(product.images[0].url)}
                  className="cursor-pointer border border-gray-700 rounded-md p-1"
                >
                  <img
                    src={product.images[0].url}
                    alt=""
                    className="w-full h-20 object-cover rounded-md"
                  />
                </div>
              )}

              {/* ✅ NEW UPLOADED IMAGES */}
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview || image.url}
                    onClick={() => setSelectedImage(image.preview || image.url)}
                    alt=""
                    className="w-full h-20 object-cover rounded-md cursor-pointer"
                  />

                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* UPLOAD */}
            <label className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-yellow-400 transition">
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              <p className="text-sm">
                Drop images or{" "}
                <span className="text-yellow-400 underline">upload</span>
              </p>
              <p className="text-xs mt-1">Max 7 images</p>
            </label>
          </motion.div>

          {/* RIGHT - FORM */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* BASIC */}
            <div className="bg-black p-5 rounded-xl border border-gray-800">
              <h3 className="mb-4 font-medium">Basic Info</h3>

              <div className="space-y-4">
                <input
                  name="title"
                  value={product.title}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 px-4 py-3 rounded-md"
                />

                <input
                  name="price"
                  value={product.price?.amount}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 px-4 py-3 rounded-md"
                />

                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 px-4 py-3 rounded-md"
                />
              </div>
            </div>

            {/* VARIANTS */}
            <div>
              <div className="flex justify-between mb-4">
                <h3 className="font-medium">Variants</h3>
                <button
                  onClick={addVariant}
                  className="text-yellow-400 text-sm"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-black p-4 rounded-xl border border-gray-800"
                  >
                    <div className="flex justify-between mb-3">
                      <p className="text-sm text-gray-400">Variant {i + 1}</p>
                      <button
                        onClick={() => removeVariant(i)}
                        className="text-red-400 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        placeholder="Price"
                        value={v.price.amount}
                        onChange={(e) =>
                          updateVariant(i, "price", {
                            ...v.price,
                            amount: e.target.value,
                          })
                        }
                        className="bg-black border border-gray-700 px-3 py-2 rounded-md"
                      />

                      <input
                        placeholder="Stock"
                        value={v.stock}
                        onChange={(e) =>
                          updateVariant(i, "stock", e.target.value)
                        }
                        className="bg-black border border-gray-700 px-3 py-2 rounded-md"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SellerProductDetails;
