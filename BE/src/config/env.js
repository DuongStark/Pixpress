import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..", "..");
const storageDir = process.env.STORAGE_DIR || path.join(rootDir, "storage");

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3001,
  apiPrefix: process.env.API_PREFIX || "/api",
  maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES) || 10485760,
  jobTtlMinutes: Number(process.env.JOB_TTL_MINUTES) || 60,
  storageDir,
  uploadDir: path.join(storageDir, "uploads"),
  resultDir: path.join(storageDir, "results"),
  tempDir: path.join(storageDir, "temp"),
  removeBgApiKey: process.env.REMOVE_BG_API_KEY || "",
};

export default env;