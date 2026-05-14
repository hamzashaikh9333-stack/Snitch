import express from "express";
import cookieParser from "cookie-parser";
import morgon from "morgan";
import authRouter from "./routes/auth.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./database/config.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import cors from "cors";

const app = express();
app.use(cors({
   origin: [
      "http://localhost:5173",
      "https://snitch-98i6.vercel.app"
   ],
   credentials: true
}));

app.use(morgon("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://snitch-30g4.onrender.com/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

app.use("/api/auth", authRouter);

app.use("/api/products", productRouter);

app.use("/api/cart", cartRouter);

export default app;
