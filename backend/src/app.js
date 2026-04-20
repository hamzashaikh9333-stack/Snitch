import express from "express";
import cookieParser from "cookie-parser";
import morgon from "morgan";
import authRouter from "./routes/auth.routes.js";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import { config } from "./database/config.js";


const app = express();


app.use(morgon("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
}))

app.use("/api/auth", authRouter);

export default app;
