import type { Language } from "../i18n";
import type { BackgroundMode, FitMode, ImageFormat, OptimizationPriority } from "../types";

const API_BASE = "/api";

export type ApiPresetOutput = {
  format: string;
  width: number | null;
  height: number | null;
  fit: string;
  background: {
    mode: string;
    color: string;
  };
  paddingPercent: number;
  quality: number;
  targetMaxBytes: number;
};

export type ApiPreset = {
  presetId: string;
  name: string;
  group: string;
  description: string;
  output: ApiPresetOutput;
};

export type ApiPresetsResponse = {
  success: boolean;
  data: ApiPreset[];
};

export async function fetchPresets(group?: string): Promise<ApiPreset[]> {
  const url = group ? `${API_BASE}/presets?group=${group}` : `${API_BASE}/presets`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch presets: ${response.statusText}`);
  }
  const data: ApiPresetsResponse = await response.json();
  return data.data;
}

const groupTranslations: Record<string, Record<Language, string>> = {
  ecommerce: { en: "E-commerce", vi: "Thương mại điện tử" },
  social: { en: "Social", vi: "Mạng xã hội" },
  website: { en: "Website", vi: "Website" },
  personal: { en: "Personal", vi: "Cá nhân" },
};

const fitModeMap: Record<string, FitMode> = {
  contain: "contain",
  cover: "cover",
  inside: "contain",
};

const backgroundModeMap: Record<string, BackgroundMode> = {
  original: "transparent",
  solid: "white",
  transparent: "transparent",
};

function mapQualityToPriority(quality: number): OptimizationPriority {
  if (quality <= 60) return "smallest";
  if (quality >= 85) return "best";
  return "balanced";
}

export function convertApiPresetToPlatformPreset(
  apiPreset: ApiPreset,
  language: Language
) {
  const groupKey = apiPreset.group as keyof typeof groupTranslations;
  const group = groupTranslations[groupKey] || { en: apiPreset.group, vi: apiPreset.group };

  const output = apiPreset.output;
  const format = output.format as ImageFormat;
  const maxSizeKb = Math.round(output.targetMaxBytes / 1024);

  const bgMode = backgroundModeMap[output.background?.mode] || "white";
  const fitMode = fitModeMap[output.fit] || "contain";

  return {
    id: apiPreset.presetId,
    group,
    name: { en: apiPreset.name, vi: apiPreset.name },
    summary: { en: apiPreset.description, vi: apiPreset.description },
    format,
    width: output.width || 0,
    height: output.height || 0,
    maxSizeKb,
    backgroundMode: bgMode,
    removeBackground: false,
    paddingPercent: output.paddingPercent,
    fitMode: fitMode,
    quality: output.quality,
    priority: mapQualityToPriority(output.quality),
  };
}