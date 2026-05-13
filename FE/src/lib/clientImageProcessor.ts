import type { ImageFormat, ProcessOptions, UploadedImage } from "../types";
import { imageMimeType } from "./format";

export type ClientProcessResult = {
  blob: Blob;
  fileName: string;
  format: ImageFormat;
  formatFallback?: boolean; // true if browser didn't support requested format, fell back to jpg
  mimeType: string;
  size: number;
  width: number;
  height: number;
  previewUrl: string;
  downloadUrl: string;
};

type DrawRect = {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
};

const rasterOutputFormats = new Set<ImageFormat>(["jpg", "png", "webp", "avif"]);

export async function processImageOnClient(image: UploadedImage, options: ProcessOptions): Promise<ClientProcessResult> {
  if (!image.file) {
    throw new Error("Missing original file. Please upload the image again.");
  }

  if (options.removeBackground) {
    throw new Error("Remove background must run on the server.");
  }

  if (!rasterOutputFormats.has(options.format)) {
    throw new Error("Unsupported output format.");
  }

  const bitmap = await createImageBitmap(image.file);

  try {
    const targetWidth = sanitizeDimension(options.resize.width, bitmap.width);
    const targetHeight = sanitizeDimension(options.resize.height, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas is not available in this browser.");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    fillBackground(context, targetWidth, targetHeight, options);

    const rect = getDrawRect(bitmap.width, bitmap.height, targetWidth, targetHeight, options);
    context.drawImage(bitmap, rect.sx, rect.sy, rect.sw, rect.sh, rect.dx, rect.dy, rect.dw, rect.dh);

    const { blob, fallback: formatFallback } = await encodeCanvas(canvas, options);
    const baseName = image.originalName.replace(/\.[^.]+$/, "") || "image";
    const actualFormat: ImageFormat = formatFallback ? "jpg" : options.format;
    const fileName = `${baseName}-pixpress.${actualFormat}`;
    const previewUrl = URL.createObjectURL(blob);

    return {
      blob,
      fileName,
      format: actualFormat,
      formatFallback,
      mimeType: blob.type || imageMimeType(actualFormat),
      size: blob.size,
      width: targetWidth,
      height: targetHeight,
      previewUrl,
      downloadUrl: previewUrl,
    };
  } finally {
    bitmap.close();
  }
}

function sanitizeDimension(value: number | null, fallback: number): number {
  if (!value || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return Math.max(1, Math.round(value));
}

function fillBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: ProcessOptions,
): void {
  const color = getBackgroundColor(options);

  if (!color) {
    context.clearRect(0, 0, width, height);
    return;
  }

  context.fillStyle = color;
  context.fillRect(0, 0, width, height);
}

function getBackgroundColor(options: ProcessOptions): string | null {
  if (options.format === "jpg") {
    return options.background.mode === "custom" ? options.background.color : "#ffffff";
  }

  if (options.background.mode === "white") {
    return "#ffffff";
  }

  if (options.background.mode === "light-gray") {
    return "#f3f4f6";
  }

  if (options.background.mode === "custom") {
    return options.background.color;
  }

  return null;
}

function getDrawRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  options: ProcessOptions,
): DrawRect {
  const crop = options.crop;
  const sx = (crop.x / 100) * sourceWidth;
  const sy = (crop.y / 100) * sourceHeight;
  const sw = (crop.width / 100) * sourceWidth;
  const sh = (crop.height / 100) * sourceHeight;

  const cropRatio = sw / sh;
  const targetRatio = targetWidth / targetHeight;
  const ratioMatch = Math.abs(cropRatio - targetRatio) < 0.01;

  // If crop matches target ratio, fill the entire frame (no padding needed)
  if (ratioMatch) {
    return {
      sx,
      sy,
      sw,
      sh,
      dx: 0,
      dy: 0,
      dw: targetWidth,
      dh: targetHeight,
    };
  }

  // Otherwise, fit crop into target with padding
  const padding = Math.min(Math.max(options.background.paddingPercent, 0), 40) / 100;
  const availableWidth = targetWidth * (1 - padding * 2);
  const availableHeight = targetHeight * (1 - padding * 2);
  const scale = Math.min(availableWidth / sw, availableHeight / sh);
  const dw = Math.max(1, Math.round(sw * scale));
  const dh = Math.max(1, Math.round(sh * scale));

  return {
    sx,
    sy,
    sw,
    sh,
    dx: Math.round((targetWidth - dw) / 2),
    dy: Math.round((targetHeight - dh) / 2),
    dw,
    dh,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

async function encodeCanvas(canvas: HTMLCanvasElement, options: ProcessOptions): Promise<{ blob: Blob; fallback: boolean }> {
  const mimeType = imageMimeType(options.format);
  const targetBytes = options.goal.maxSizeKb > 0 ? options.goal.maxSizeKb * 1024 : null;

  if (!targetBytes || options.format === "png") {
    return canvasToBlob(canvas, mimeType, options.quality / 100);
  }

  const minQuality = getMinQuality(options.goal.priority);
  let quality = Math.min(Math.max(options.quality, minQuality), 100);
  let best = await canvasToBlob(canvas, mimeType, quality / 100);

  while (best.blob.size > targetBytes && quality > minQuality) {
    quality = Math.max(minQuality, quality - 8);
    best = await canvasToBlob(canvas, mimeType, quality / 100);
  }

  return best;
}

function getMinQuality(priority: ProcessOptions["goal"]["priority"]): number {
  if (priority === "smallest") return 45;
  if (priority === "best") return 75;
  return 60;
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<{ blob: Blob; fallback: boolean }> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          canvas.toBlob(
            (fallbackBlob) => {
              if (!fallbackBlob) { reject(new Error("Browser could not encode this image.")); return; }
              resolve({ blob: fallbackBlob, fallback: true });
            },
            "image/jpeg",
            quality,
          );
          return;
        }
        if (mimeType !== "image/png" && blob.type && blob.type !== mimeType) {
          canvas.toBlob(
            (fallbackBlob) => {
              if (!fallbackBlob) { reject(new Error("Browser could not encode this image.")); return; }
              resolve({ blob: fallbackBlob, fallback: true });
            },
            "image/jpeg",
            quality,
          );
          return;
        }
        resolve({ blob, fallback: false });
      },
      mimeType,
      quality,
    );
  });
}
