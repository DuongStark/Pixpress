import dotenv from "dotenv";

dotenv.config();

const env = {
  port: Number(process.env.PORT) || 3001,
  apiPrefix: process.env.API_PREFIX || "/api",
  maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES) || 10485760,
};

export default env;
