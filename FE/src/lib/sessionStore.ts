import { ProcessOptions, ProcessedJob, UploadedImage } from "../types";
import { estimateResultSize } from "./estimate";
import { imageMimeType } from "./format";

const activeImageKey = "pixpress.activeImage";
const jobsKey = "pixpress.jobs";

type StoredImage = Omit<UploadedImage, "file">;

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
  return image;
}

function stripFile(image: UploadedImage): StoredImage {
  const { file: _file, ...stored } = image;
  return stored;
}

export function getActiveImage(): UploadedImage | null {
  const raw = sessionStorage.getItem(activeImageKey);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as UploadedImage;
}

export function clearActiveImage(): void {
  sessionStorage.removeItem(activeImageKey);
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

export function getJob(jobId: string): ProcessedJob | null {
  return getJobs()[jobId] ?? null;
}

function getJobs(): Record<string, ProcessedJob> {
  const raw = sessionStorage.getItem(jobsKey);
  return raw ? (JSON.parse(raw) as Record<string, ProcessedJob>) : {};
}
