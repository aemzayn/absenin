import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? "access_secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? "refresh_secret",
};

export default config;
