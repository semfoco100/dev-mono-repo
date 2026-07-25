import "dotenv/config";
import path from "node:path";

export type AppConfig = {
  host: string;
  user: string;
  password: string;
  mid: string;
  downloadDir: string;
  maxDepth: number;
  verbose: boolean;
};

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function loadConfig(): AppConfig {
  return {
    host: process.env.RAKUTEN_AFTP_HOST ?? "aftp.linksynergy.com",
    user: requiredEnv("RAKUTEN_AFTP_USER"),
    password: requiredEnv("RAKUTEN_AFTP_PASSWORD"),
    mid: process.env.RAKUTEN_MID ?? "46796",
    downloadDir: path.resolve(process.env.RAKUTEN_DOWNLOAD_DIR ?? "downloads"),
    maxDepth: Number(process.env.RAKUTEN_MAX_DEPTH ?? "4"),
    verbose: process.env.RAKUTEN_VERBOSE === "true"
  };
}
