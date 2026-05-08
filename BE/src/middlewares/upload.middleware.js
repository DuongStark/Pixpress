import multer from "multer";
import { memoryStorage } from "multer";
import env from "../config/env.js";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = env.maxUploadBytes || 10 * 1024 * 1024; // 10MB

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`), false);
  }
};

const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

export const uploadMiddleware = {
  single: upload.single("file"),
};

export default uploadMiddleware;