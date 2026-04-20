import React from "react";

const GoogleButton = () => {
  return (
    <a
      href="/api/auth/google"
      className="flex items-center justify-center gap-3 w-full h-12 bg-gray-900 border border-gray-700 rounded-md hover:bg-gray-800 transition shadow-md"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span className="text-sm font-medium text-white">
        Continue with Google
      </span>
    </a>
  );
};

export default GoogleButton;
