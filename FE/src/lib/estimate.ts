import type { ImageFormat, ProcessOptions, UploadedImage } from "../types";

export function estimateResultSize(
  image: UploadedImage,
  options: ProcessOptions,
  resultWidth: number,
  resultHeight: number,
): number {
  const formatFactor: Record<ImageFormat, number> = {
    jpg: 0.74,
    png: 0.95,
    webp: 0.58,
    avif: 0.44,
  };
  const priorityFactor = {
    smallest: 0.72,
    balanced: 0.86,
    best: 1,
  }[options.goal.priority];
  const originalPixels = Math.max(1, image.width * image.height);
  const resultPixels = Math.max(1, resultWidth * resultHeight);
  const resizeFactor = Math.min(1, Math.sqrt(resultPixels / originalPixels));
  const backgroundFactor = options.removeBackground ? 1.05 : 1;
  const qualityFactor = Math.max(0.18, options.quality / 100);
  const rawEstimate = image.size * formatFactor[options.format] * qualityFactor * resizeFactor * priorityFactor * backgroundFactor;
  const targetBytes = options.goal.maxSizeKb * 1024;

  if (options.goal.priority === "best") {
    return Math.max(1024, Math.round(rawEstimate));
  }

  return Math.max(1024, Math.round(Math.min(rawEstimate, targetBytes * (options.goal.priority === "smallest" ? 0.88 : 0.96))));
}
