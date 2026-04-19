import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
  });

  // handle input change (two-way binding)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // backend ke liye yahi data jayega
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex justify-center items-center">
      <div className="w-[400px] bg-gray-800 p-8 rounded-2xl shadow-lg">
        
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Full Name */}
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Contact */}
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Register
          </button>

        </form>
      </div>
    </div>
  );
};

export default Register;