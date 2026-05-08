import sharp from "sharp";
import env from "../config/env.js";
import { HttpError } from "../middlewares/error.middleware.js";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedFormats = new Set(["jpg", "jpeg", "png", "webp", "avif"]);

export async function processImageFallbackHandler(req, res, next) {
  try {
    if (!req.file) {
      throw new HttpError(400, "No file uploaded.");
    }

    const file = req.file;

    if (!allowedTypes.includes(file.mimetype)) {
      throw new HttpError(400, `Unsupported file type: ${file.mimetype}`);
    }

    if (file.size > env.maxUploadBytes) {
      throw new HttpError(400, `File too large: ${file.size} bytes. Max: ${env.maxUploadBytes} bytes`);
    }

    const metadata = await sharp(file.buffer).metadata();

    if (!metadata.width || !metadata.height) {
      throw new HttpError(400, "Cannot read image metadata.");
    }

    const options = parseOptions(req.body.options);
    const format = normalizeFormat(options.format || metadata.format || "webp");
    const quality = clampNumber(options.quality, 1, 100, 82);
    const resize = options.resize || {};
    const width = parsePositiveInteger(resize.width);
    const height = parsePositiveInteger(resize.height);
    const fit = normalizeFit(resize.fit || resize.fitMode || "inside");

    let pipeline = sharp(file.buffer, { failOn: "error" });

    if (width || height) {
      pipeline = pipeline.resize({
        width,
        height,
        fit,
        withoutEnlargement: true,
      });
    }

    pipeline = encodeOutput(pipeline, format, quality);

    const outputBuffer = await pipeline.toBuffer();
    const outputMetadata = await sharp(outputBuffer).metadata();
    const fileName = createOutputFileName(file.originalname, format);

    res.set({
      "Content-Type": mimeTypeForFormat(format),
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "X-Pixpress-File-Name": fileName,
      "X-Pixpress-Format": format,
      "X-Pixpress-Size": String(outputBuffer.length),
      "X-Pixpress-Width": String(outputMetadata.width || ""),
      "X-Pixpress-Height": String(outputMetadata.height || ""),
    });

    res.send(outputBuffer);
  } catch (error) {
    next(error);
  }
}

function parseOptions(rawOptions) {
  if (!rawOptions) {
    return {};
  }

  if (typeof rawOptions === "object") {
    return rawOptions;
  }

  try {
    return JSON.parse(rawOptions);
  } catch {
    throw new HttpError(400, "Invalid options JSON.");
  }
}

function normalizeFormat(format) {
  const normalized = String(format).trim().toLowerCase();

  if (!allowedFormats.has(normalized)) {
    throw new HttpError(400, "Unsupported output format.");
  }

  return normalized === "jpeg" ? "jpg" : normalized;
}

function normalizeFit(fit) {
  const normalized = String(fit).trim().toLowerCase();

  if (["contain", "cover", "inside"].includes(normalized)) {
    return normalized;
  }

  if (normalized === "pad") {
    return "contain";
  }

  throw new HttpError(400, "Unsupported resize fit.");
}

function parsePositiveInteger(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, "Resize width and height must be positive integers.");
  }

  return parsed;
}

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function encodeOutput(pipeline, format, quality) {
  if (format === "jpg") {
    return pipeline.jpeg({ quality });
  }

  if (format === "png") {
    return pipeline.png({ quality });
  }

  if (format === "avif") {
    return pipeline.avif({ quality });
  }

  return pipeline.webp({ quality });
}

function mimeTypeForFormat(format) {
  return {
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    avif: "image/avif",
  }[format];
}

function createOutputFileName(originalName, format) {
  const baseName = String(originalName || "image").replace(/\.[^.]+$/, "") || "image";
  const extension = format === "jpg" ? "jpg" : format;
  return `${baseName}-pixpress.${extension}`;
}
