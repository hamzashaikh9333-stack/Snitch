import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const Login = () => {
  const navigate = useNavigate();

  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email: formData.email, password: formData.password });
    navigate("/");
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-black">
      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 h-full relative">
        <img
          src="https://i.pinimg.com/1200x/9b/b2/8a/9bb28a6fd213382655dece44808217cf.jpg"
          alt="model"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-10">
          <h1 className="text-yellow-400 font-semibold tracking-widest">
            SNITCH.
          </h1>

          <h2 className="text-white text-4xl font-semibold leading-tight">
            Define your <br />
            <span className="text-yellow-400">aesthetic.</span>
          </h2>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <p className="text-yellow-400 text-xs tracking-widest mb-3">
            WELCOME BACK
          </p>

          <h1 className="text-white text-4xl font-bold mb-10">
            Login to your account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-600 text-white py-3 px-1 outline-none focus:border-yellow-400 transition placeholder-gray-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm">Password</label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder=""
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-600 text-white py-3 px-1 pr-10 outline-none focus:border-yellow-400 transition placeholder-gray-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-md transition shadow-lg shadow-yellow-500/20"
            >
              Sign In
            </button>

            {/* Footer */}
            <p className="text-gray-400 text-sm text-center mt-4">
              Don’t have an account?{" "}
              <span className="text-yellow-400 cursor-pointer hover:underline">
                <Link to="/register">Register</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
