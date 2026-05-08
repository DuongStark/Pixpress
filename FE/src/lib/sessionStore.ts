import { ComplianceReport, MultiPlatformExport, ProcessOptions, ProcessedJob, UploadedImage } from "../types";
import { processImageOnClient } from "./clientImageProcessor";
import type { ClientProcessResult } from "./clientImageProcessor";
import { estimateResultSize } from "./estimate";
import { imageMimeType } from "./format";
import { platformPresets } from "./presets";

const activeImageKey = "pixpress.activeImage";
const jobsKey = "pixpress.jobs";
const exportsKey = "pixpress.exports";

type StoredImage = Omit<UploadedImage, "file">;
let activeImageMemory: UploadedImage | null = null;

function createId(prefix: string): string {
  const suffix = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
  return `${prefix}_${suffix}`;
}

function loadImageSize(file: File): Promise<{ width: number; height: number; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight, previewUrl });
    };

    image.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error("The image could not be read."));
    };

    image.src = previewUrl;
  });
}

export async function createLocalImage(file: File): Promise<UploadedImage> {
  const { width, height, previewUrl } = await loadImageSize(file);

  const image: UploadedImage = {
    imageId: createId("img"),
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    width,
    height,
    previewUrl,
    file,
  };

  sessionStorage.setItem(activeImageKey, JSON.stringify(stripFile(image)));
  activeImageMemory = image;
  return image;
}

function stripFile(image: UploadedImage): StoredImage {
  const { file: _file, ...stored } = image;
  return stored;
}

export function getActiveImage(): UploadedImage | null {
  if (activeImageMemory) {
    return activeImageMemory;
  }

  const raw = sessionStorage.getItem(activeImageKey);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as UploadedImage;
}

export function clearActiveImage(): void {
  sessionStorage.removeItem(activeImageKey);
  activeImageMemory = null;
}

export function createJob(image: UploadedImage, options: ProcessOptions): ProcessedJob {
  const jobId = createId("job");
  const width = options.resize.width ?? image.width;
  const height = options.resize.height ?? image.height;
  const estimatedSize = estimateResultSize(image, options, width, height);
  const baseName = image.originalName.replace(/\.[^.]+$/, "") || "image";

  const job: ProcessedJob = {
    jobId,
    imageId: image.imageId,
    status: "completed",
    original: stripFile(image),
    options,
    result: {
      fileName: `${baseName}.${options.format}`,
      format: options.format,
      mimeType: imageMimeType(options.format),
      size: estimatedSize,
      width,
      height,
      previewUrl: image.previewUrl,
      downloadUrl: image.previewUrl,
    },
  };

  const jobs = getJobs();
  jobs[jobId] = job;
  sessionStorage.setItem(jobsKey, JSON.stringify(jobs));
  return job;
}

export function createJobFromClientResult(
  image: UploadedImage,
  options: ProcessOptions,
  result: ClientProcessResult,
): ProcessedJob {
  const jobId = createId("job");

  const job: ProcessedJob = {
    jobId,
    imageId: image.imageId,
    status: "completed",
    original: stripFile(image),
    options,
    result: {
      fileName: result.fileName,
      format: result.format,
      mimeType: result.mimeType,
      size: result.size,
      width: result.width,
      height: result.height,
      previewUrl: result.previewUrl,
      downloadUrl: result.downloadUrl,
    },
  };

  const jobs = getJobs();
  jobs[jobId] = job;
  sessionStorage.setItem(jobsKey, JSON.stringify(jobs));
  return job;
}

export function getJob(jobId: string): ProcessedJob | null {
  return getJobs()[jobId] ?? null;
}

function getJobs(): Record<string, ProcessedJob> {
  const raw = sessionStorage.getItem(jobsKey);
  return raw ? (JSON.parse(raw) as Record<string, ProcessedJob>) : {};
}

export async function createMultiPlatformExport(
  image: UploadedImage,
  presetIds: string[],
  baseOptions: ProcessOptions,
): Promise<MultiPlatformExport> {
  const exportId = createId("export");
  const baseName = image.originalName.replace(/\.[^.]+$/, "") || "image";
  const variants = await Promise.all(presetIds
    .map((presetId) => platformPresets.find((preset) => preset.id === presetId))
    .filter((preset): preset is NonNullable<typeof preset> => Boolean(preset))
    .map(async (preset) => {
      const width = preset.width || image.width;
      const height = preset.height || image.height;
      const options: ProcessOptions = {
        ...baseOptions,
        format: preset.format,
        quality: preset.quality,
        resize: {
          ...baseOptions.resize,
          width,
          height,
          fitMode: "cover",
        },
        crop: getDefaultCropRect(image.width, image.height, width, height),
        goal: {
          maxSizeKb: preset.maxSizeKb,
          priority: preset.priority,
        },
        background: {
          ...baseOptions.background,
          mode: preset.backgroundMode,
          paddingPercent: preset.paddingPercent,
        },
        preset: {
          id: preset.id,
          name: preset.name.vi,
        },
      };
      const result = await processImageOnClient(image, options);
      const goalPassed = result.size <= preset.maxSizeKb * 1024;
      const platform = preset.name.vi.replace(" ảnh sản phẩm", "").replace(" product photo", "");
      const fileName = `${baseName}-${preset.id.replace("-product", "").replace("-square", "")}.${preset.format}`;

      return {
        variantId: createId("variant"),
        platform,
        presetId: preset.id,
        status: "completed" as const,
        result: {
          fileName,
          format: result.format,
          mimeType: result.mimeType || imageMimeType(preset.format),
          size: result.size,
          width: result.width,
          height: result.height,
          previewUrl: result.previewUrl,
          downloadUrl: result.downloadUrl,
        },
        options,
        goalPassed,
        compliance: createCompliance(goalPassed, result.width, result.height, preset.maxSizeKb, result.format.toUpperCase()),
      };
    }));

  const exportJob: MultiPlatformExport = {
    exportId,
    imageId: image.imageId,
    status: "completed",
    original: stripFile(image),
    variants,
    zipDownloadUrl: variants[0]?.result.downloadUrl ?? image.previewUrl,
  };

  const exports = getExports();
  exports[exportId] = exportJob;
  sessionStorage.setItem(exportsKey, JSON.stringify(exports));
  return exportJob;
}

export function getExport(exportId: string): MultiPlatformExport | null {
  return getExports()[exportId] ?? null;
}

export function saveExport(exportJob: MultiPlatformExport): void {
  const exports = getExports();
  exports[exportJob.exportId] = exportJob;
  sessionStorage.setItem(exportsKey, JSON.stringify(exports));
}

function getExports(): Record<string, MultiPlatformExport> {
  const raw = sessionStorage.getItem(exportsKey);
  return raw ? (JSON.parse(raw) as Record<string, MultiPlatformExport>) : {};
}

function createCompliance(
  goalPassed: boolean,
  width: number,
  height: number,
  maxSizeKb: number,
  format: string,
): ComplianceReport {
  return {
    status: goalPassed ? "needs_review" : "failed",
    checks: [
      {
        code: "DIMENSIONS",
        level: "pass",
        label: "Kích thước",
        message: `${width} x ${height}px`,
      },
      {
        code: "RATIO",
        level: width === height ? "pass" : "warning",
        label: "Tỉ lệ",
        message: width === height ? "1:1" : `${width}:${height}`,
      },
      {
        code: "FILE_SIZE",
        level: goalPassed ? "pass" : "fail",
        label: "Dung lượng",
        message: goalPassed ? `Dưới mục tiêu ${maxSizeKb}KB` : `Vượt mục tiêu ${maxSizeKb}KB`,
      },
      {
        code: "FORMAT",
        level: "pass",
        label: "Định dạng",
        message: format,
      },
      {
        code: "MANUAL_REVIEW",
        level: "warning",
        label: "Nội dung ảnh",
        message: "Hãy kiểm tra sản phẩm, chữ và logo trước khi đăng.",
      },
    ],
  };
}

function getDefaultCropRect(sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number): ProcessOptions["crop"] {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  if (sourceRatio > targetRatio) {
    const width = (targetRatio / sourceRatio) * 100;
    return { x: (100 - width) / 2, y: 0, width, height: 100 };
  }

  const height = (sourceRatio / targetRatio) * 100;
  return { x: 0, y: (100 - height) / 2, width: 100, height };
}
