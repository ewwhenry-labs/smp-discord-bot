import dotenv from "dotenv";
import path from "node:path";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const BOT_TOKEN = process.env.BOT_TOKEN!;
export const BASE_DIR = path.resolve(
  NODE_ENV === "production" ? "dist" : "src",
);
