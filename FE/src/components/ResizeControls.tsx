import { Crop, Image, Lock, Scan } from "lucide-react";
import { useI18n } from "../i18n";
import type { Language } from "../i18n";
import type { FitMode } from "../types";
import styles from "./ResizeControls.module.css";

const fitModes: FitMode[] = ["contain", "cover", "pad"];

const fitLabels: Record<FitMode, Record<Language, string>> = {
  contain: { en: "Keep full image", vi: "Giữ đủ ảnh" },
  cover: { en: "Crop to frame", vi: "Cắt theo khung" },
  pad: { en: "Add background", vi: "Thêm nền" },
};

const fitTooltips: Record<FitMode, Record<Language, string>> = {
  contain: { en: "Fit the whole image inside the frame.", vi: "Giữ trọn ảnh trong khung." },
  cover: { en: "Fill the frame by cropping overflow.", vi: "Lấp đầy khung bằng cách cắt phần thừa." },
  pad: { en: "Keep the image whole and fill empty space with background.", vi: "Giữ trọn ảnh và thêm nền vào khoảng trống." },
};

const fitIcons = {
  contain: Image,
  cover: Crop,
  pad: Scan,
};

type ResizeControlsProps = {
  width: number | null;
  height: number | null;
  keepAspectRatio: boolean;
  fitMode: FitMode;
  disabled?: boolean;
  onWidthChange: (width: number | null) => void;
  onHeightChange: (height: number | null) => void;
  onKeepAspectRatioChange: (value: boolean) => void;
  onFitModeChange: (value: FitMode) => void;
  onCropReset: () => void;
};

export default function ResizeControls({
  width,
  height,
  keepAspectRatio,
  fitMode,
  disabled = false,
  onWidthChange,
  onHeightChange,
  onKeepAspectRatioChange,
  onFitModeChange,
  onCropReset,
}: ResizeControlsProps) {
  const { language, t } = useI18n();

  return (
    <fieldset className={styles.fieldset}>
      <legend>{t.controls.resize}</legend>
      <div className={styles.inputs}>
        <label>
          {t.controls.width}
          <input
            disabled={disabled}
            min={1}
            type="number"
            value={width ?? ""}
            onChange={(event) => onWidthChange(parseDimension(event.target.value))}
          />
        </label>
        <label>
          {t.controls.height}
          <input
            disabled={disabled}
            min={1}
            type="number"
            value={height ?? ""}
            onChange={(event) => onHeightChange(parseDimension(event.target.value))}
          />
        </label>
      </div>
      <label className={styles.checkbox}>
        <input
          checked={keepAspectRatio}
          disabled={disabled}
          type="checkbox"
          onChange={(event) => onKeepAspectRatioChange(event.target.checked)}
        />
        <Lock size={16} aria-hidden="true" />
        {t.controls.keepAspect}
      </label>
      <div className={styles.segmented} role="radiogroup" aria-label={language === "vi" ? "Cách canh ảnh" : "Image framing"}>
        {fitModes.map((mode) => {
          const Icon = fitIcons[mode];
          return (
            <button
              aria-checked={fitMode === mode}
              className={fitMode === mode ? styles.active : ""}
              disabled={disabled}
              key={mode}
              role="radio"
              title={fitTooltips[mode][language]}
              type="button"
              onClick={() => onFitModeChange(mode)}
            >
              <Icon size={15} aria-hidden="true" />
              <span>{fitLabels[mode][language]}</span>
            </button>
          );
        })}
      </div>
      {fitMode === "cover" ? (
        <div className={styles.cropControls}>
          <button className={styles.resetCrop} disabled={disabled} type="button" onClick={onCropReset}>
            {language === "vi" ? "Đặt lại khung" : "Reset crop"}
          </button>
        </div>
      ) : null}
    </fieldset>
  );
}

function parseDimension(value: string): number | null {
  if (value === "") {
    return null;
  }

  return Number(value);
}
