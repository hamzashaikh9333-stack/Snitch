import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";

const NavCart = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart?.items) || [];
  return (
    <nav
      className="px-8 lg:px-16 xl:px-24 pt-6 pb-5 flex items-center justify-between border-b"
      style={{ borderColor: "#e4e2df" }}
    >
      <Link
        to="/"
        className="text-sm font-bold tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Snitch.
      </Link>
      <div
        className="flex gap-6 items-center text-[10px] uppercase tracking-[0.2em] font-medium"
        style={{ color: "#7A6E63" }}
      >
        {user ? (
          <>
            <span 
            className="text-xs"
            style={{ color: "#1b1c1a" }}>{user.fullname}</span>
            {user.role === "seller" && (
              <Link
                to="/seller/dashboard"
                className="transition-colors hover:text-[#C9A96E]"
              >
                Seller Dashboard
              </Link>
            )}
            <Link
              to="/cart"
              className="relative flex items-center hover:opacity-70 transition-opacity"
              style={{ color: "#1b1c1a" }}
              aria-label="Shopping cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartItems?.length > 0 && (
                <span
                  className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                  style={{
                    backgroundColor: "#C9A96E",
                    width: "16px",
                    height: "16px",
                    fontSize: "9px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    letterSpacing: 0,
                  }}
                >
                  {cartItems.length > 9 ? "9+" : cartItems.length}
                </span>
              )}
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="transition-colors hover:text-[#e9a526] text-xs font-bold"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="transition-colors hover:text-[#d99923] text-xs font-bold"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavCart;
