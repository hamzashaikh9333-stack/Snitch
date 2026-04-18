import dotenv from "dotenv";

dotenv.config();


if(!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined");
}

if(!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined");
}

export const config = {
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}