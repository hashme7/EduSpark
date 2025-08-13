import dotenv from "dotenv";
import { AppError } from "../utils/error";

dotenv.config();

interface Config {
  port: number;
  jwtSecret: string;
  jwtExpiresIn: number;
  bcryptRounds: number;
  mongoUri: string;
  nodeEnv: string;
}

const getConfig = (): Config => {
  const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new AppError(`Environment variable ${envVar} is required`, 500);
    }
  }

  return {
    port: parseInt(process.env["PORT"] || "3000", 10),
    jwtSecret: process.env["JWT_SECRET"]!,
    jwtExpiresIn: parseInt(process.env["JWT_EXPIRES_IN"] || "7d", 10),
    bcryptRounds: parseInt(process.env["BCRYPT_ROUNDS"] || "12", 10),
    mongoUri: process.env["MONGODB_URI"]!,
    nodeEnv: process.env["NODE_ENV"] || "development",
  };
};

export const config = getConfig();
