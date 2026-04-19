import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
      email: formData.email,
      fullname: formData.fullname,
      contact: formData.contact,
      password: formData.password,
      isSeller: formData.isSeller,
    });
    navigate("/");
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-black">
      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 h-full relative">
        <img
          src="https://i.pinimg.com/736x/20/69/a5/2069a5d234030c5eb99f12402f4561d6.jpg"
          alt="model"
          className="w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-10">
          {/* Top logo */}
          <h1 className="text-yellow-400 mt-22 font-semibold tracking-widest">
            SNITCH.
          </h1>

          {/* Bottom text */}
          <h2 className="text-white text-4xl font-semibold leading-tight">
            Define your <br />
            <span className="text-yellow-400">aesthetic.</span>
          </h2>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Top text */}
          <p className="text-yellow-400 text-xs tracking-widest mb-3">
            WELCOME TO SNITCH
          </p>

          {/* Heading */}
          <h1 className="text-white text-4xl font-bold mb-10">
            Elevate Your Style
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Full Name */}
            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              <input
                type="text"
                name="fullname"
                placeholder=""
                value={formData.fullname}
                onChange={handleChange}
                className="w-full mt-2 bg-transparent border-b border-gray-600 text-white py-2 outline-none focus:border-yellow-400 transition"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="text-gray-400 text-sm">Contact Number</label>
              <input
                type="text"
                name="contact"
                placeholder=""
                value={formData.contact}
                onChange={handleChange}
                className="w-full mt-2 bg-transparent border-b border-gray-600 text-white py-2 outline-none focus:border-yellow-400 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 bg-transparent border-b border-gray-600 text-white py-2 outline-none focus:border-yellow-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm">Password</label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-600 text-white py-3 pr-10 pl-1 outline-none focus:border-yellow-400 transition"
                />

                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 text-gray-300 text-sm">
              <input
                type="checkbox"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleChange}
                className="accent-yellow-400"
              />
              Register as Seller
            </label>

            {/* Button */}
            <button
              type="submit"
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-md transition shadow-lg shadow-yellow-500/20"
            >
              Sign Up
            </button>

            {/* Footer */}
            <p className="text-gray-400 text-sm text-center mt-4">
              Already have an account?{" "}
              <span className="text-yellow-400 cursor-pointer hover:underline">
                <Link to="/login">Login</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
