import express from "express";
import env from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import presetRoutes from "./routes/preset.routes.js";
import imageRoutes from "./routes/image.routes.js";

import { defaultRateLimit } from "./middlewares/rate-limit.middleware.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");
app.use(defaultRateLimit);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "pixpress-backend",
    status: "running",
  });
});

app.use(`${env.apiPrefix}/health`, healthRoutes);
app.use(`${env.apiPrefix}/presets`, presetRoutes);
app.use(`${env.apiPrefix}/images`, imageRoutes)

app.use(notFoundHandler);
app.use(errorHandler);

export default app;