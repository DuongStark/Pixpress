export type ImageFormat = "jpg" | "png" | "webp" | "avif";
export type FitMode = "contain" | "cover" | "pad";
export type BackgroundMode = "transparent" | "white" | "light-gray" | "custom";
export type OptimizationPriority = "smallest" | "balanced" | "best";

export type UploadedImage = {
  imageId: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  previewUrl: string;
  file?: File;
};

export type ProcessOptions = {
  format: ImageFormat;
  quality: number;
  resize: {
    width: number | null;
    height: number | null;
    keepAspectRatio: boolean;
    fitMode: FitMode;
  };
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  removeBackground: boolean;
  goal: {
    maxSizeKb: number;
    priority: OptimizationPriority;
  };
  background: {
    mode: BackgroundMode;
    color: string;
    paddingPercent: number;
    centerProduct: boolean;
    softShadow: boolean;
  };
  preset: {
    id: string;
    name: string;
  };
};

export type ProcessedJob = {
  jobId: string;
  imageId: string;
  status: "completed";
  original: UploadedImage;
  result: {
    fileName: string;
    format: ImageFormat;
    mimeType: string;
    size: number;
    width: number;
    height: number;
    previewUrl: string;
    downloadUrl: string;
  };
  options: ProcessOptions;
};

export type ComplianceLevel = "pass" | "warning" | "fail";
export type ComplianceStatus = "passed" | "needs_review" | "failed";

export type ComplianceCheck = {
  code: string;
  level: ComplianceLevel;
  label: string;
  message: string;
};

export type ComplianceReport = {
  status: ComplianceStatus;
  checks: ComplianceCheck[];
};

export type ExportVariant = {
  variantId: string;
  platform: string;
  presetId: string;
  status: "completed";
  result: ProcessedJob["result"];
  goalPassed: boolean;
  compliance: ComplianceReport;
};

export type MultiPlatformExport = {
  exportId: string;
  imageId: string;
  status: "completed";
  original: UploadedImage;
  variants: ExportVariant[];
  zipDownloadUrl: string;
};
