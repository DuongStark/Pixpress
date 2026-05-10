import dotenv from "dotenv";

dotenv.config();

const env = {
  port: Number(process.env.PORT) || 3001,
  apiPrefix: process.env.API_PREFIX || "/api",
  maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES) || 10485760,
  corsOrigins: (
    process.env.CORS_ORIGINS ||
    "https://pixpress.art,https://www.pixpress.art,http://localhost:5173,http://127.0.0.1:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export default env;
