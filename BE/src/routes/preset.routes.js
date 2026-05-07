import { Router } from "express";
import { listPresetsHandler } from "../controllers/preset.controller.js";

const router = Router();

router.get("/", listPresetsHandler);

export default router;