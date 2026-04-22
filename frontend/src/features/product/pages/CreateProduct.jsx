import React, { useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useNavigate } from "react-router";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
    images: [],
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ADD IMAGES (common function)
  const addImages = (files) => {
    const newFiles = Array.from(files);

    if (formData.images.length + newFiles.length > 7) {
      alert("Max 7 images allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));
  };

  // INPUT UPLOAD
  const handleImageUpload = (e) => {
    addImages(e.target.files);
  };

  // DRAG EVENTS
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addImages(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);

      formData.images.forEach((image) => {
        data.append("images", image);
      });

      await handleCreateProduct(data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col">
      {/* HEADER */}
      <div className="px-4 md:px-10 py-6">
        <p className="text-yellow-400 text-xs tracking-widest mb-2">SNITCH.</p>

        <h1 className="text-2xl md:text-3xl font-semibold mt-3">New Listing</h1>

        <div className="w-20 h-[2px] bg-yellow-400 mt-2"></div>
      </div>

      {/* MAIN */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-10 px-4 md:px-10 pb-10"
      >
        {/* LEFT */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          {/* TITLE */}
          <div>
            <label className="text-yellow-400 text-xs tracking-widest">
              PRODUCT TITLE
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder=""
              className="w-full mt-2 bg-transparent border-b border-gray-600 py-3 px-1 outline-none focus:border-yellow-400 transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-yellow-400 text-xs tracking-widest">
              DESCRIPTION
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the product — material, fit, details..."
              className="w-full mt-2 bg-transparent border-b border-gray-600 py-3 px-1 outline-none focus:border-yellow-400 resize-none"
            />
          </div>

          {/* PRICE */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-2/3">
              <label className="text-yellow-400 text-xs tracking-widest">
                PRICE
              </label>
              <input
                type="number"
                name="priceAmount"
                value={formData.priceAmount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full mt-2 bg-transparent border-b border-gray-600 py-3 px-1 outline-none focus:border-yellow-400"
              />
            </div>

            <div className="w-full sm:w-1/3">
              <label className="text-yellow-400 text-xs tracking-widest">
                CURRENCY
              </label>

              <select
                name="priceCurrency"
                value={formData.priceCurrency}
                onChange={handleChange}
                className="w-full mt-2 bg-transparent border-b border-gray-600 py-3 px-1 outline-none focus:border-yellow-400 text-white appearance-none cursor-pointer"
              >
                <option value="INR" className="bg-black">
                  INR
                </option>
                <option value="USD" className="bg-black">
                  USD
                </option>
                <option value="EUR" className="bg-black">
                  EUR
                </option>
                <option value="GBP" className="bg-black">
                  GBP
                </option>
                <option value="JPY" className="bg-black">
                  JPY
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT (UPLOAD) */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex justify-between mb-3">
            <label className="text-yellow-400 text-xs tracking-widest">
              IMAGES
            </label>
            <span className="text-gray-400 text-sm">
              {formData.images.length}/7
            </span>
          </div>

          {/* DROP ZONE */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-10 cursor-pointer transition
              ${
                isDragging
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-gray-600 hover:border-yellow-400"
              }`}
          >
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="fileInput"
            />

            <label htmlFor="fileInput" className="cursor-pointer">
              <p className="text-gray-400">
                Drop images here or{" "}
                <span className="text-yellow-400 underline">tap to upload</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">UP TO 7 IMAGES</p>
            </label>
          </div>

          {/* PREVIEW */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-6">
              {formData.images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-full h-20 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>
      </form>

      {/* BUTTON */}
      <div className="px-4 md:px-10 pb-8">
        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-md transition shadow-lg shadow-yellow-500/20"
        >
          PUBLISH LISTING
        </button>
      </div>
    </div>
  );
};

export default CreateProduct;
