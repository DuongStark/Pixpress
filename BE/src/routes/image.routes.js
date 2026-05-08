import { Router } from "express";
import { processImageFallbackHandler } from "../controllers/image.controller.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/process", uploadMiddleware.single, processImageFallbackHandler);

export default router;
