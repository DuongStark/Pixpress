import { Lock } from "lucide-react";
import { useI18n } from "../i18n";
import styles from "./ResizeControls.module.css";

type ResizeControlsProps = {
  width: number | null;
  height: number | null;
  keepAspectRatio: boolean;
  paddingPercent: number;

  originalWidth?: number;
  originalHeight?: number;
  disabled?: boolean;
  onWidthChange: (width: number | null) => void;
  onHeightChange: (height: number | null) => void;
  onBothChange: (width: number, height: number) => void;
  onKeepAspectRatioChange: (value: boolean) => void;
  onPaddingChange: (value: number) => void;
  onCropReset: () => void;
};

const RATIO_PRESETS = [
  { label: "1:1", w: 1, h: 1 },
  { label: "4:3", w: 4, h: 3 },
  { label: "3:4", w: 3, h: 4 },
  { label: "16:9", w: 16, h: 9 },
  { label: "9:16", w: 9, h: 16 },
] as const;

export default function ResizeControls({
  width,
  height,
  keepAspectRatio,
  paddingPercent,
  originalWidth,
  originalHeight,
  disabled = false,
  onWidthChange,
  onHeightChange,
  onBothChange,
  onKeepAspectRatioChange,
  onPaddingChange,
  onCropReset,
}: ResizeControlsProps) {
  const { language, t } = useI18n();

  const currentRatio = width && height ? width / height : null;

  function applyRatio(rw: number, rh: number) {
    const baseWidth = width || 1080;
    const newHeight = Math.round(baseWidth * (rh / rw));
    onBothChange(baseWidth, newHeight);
  }

  function applyOriginalRatio() {
    if (!originalWidth || !originalHeight) return;
    onBothChange(originalWidth, originalHeight);
  }

  function isActiveRatio(rw: number, rh: number): boolean {
    if (!currentRatio) return false;
    const target = rw / rh;
    return Math.abs(currentRatio - target) < 0.01;
  }

  const isOriginalActive = originalWidth && originalHeight && currentRatio
    ? Math.abs(currentRatio - originalWidth / originalHeight) < 0.01
    : false;

  return (
    <fieldset className={styles.fieldset}>
      <div className={styles.controlBlock}>
        <div className={styles.blockHeader}>
          <span>{language === "vi" ? "Tỉ lệ khung hình" : "Aspect ratio"}</span>
        </div>
        <div className={styles.ratioRow}>
          {originalWidth && originalHeight ? (
            <button
              className={`${styles.ratioBtn} ${isOriginalActive ? styles.ratioBtnActive : ""}`}
              disabled={disabled}
              type="button"
              onClick={applyOriginalRatio}
            >
              {language === "vi" ? "Gốc" : "Original"}
            </button>
          ) : null}
          {RATIO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              className={`${styles.ratioBtn} ${isActiveRatio(preset.w, preset.h) ? styles.ratioBtnActive : ""}`}
              disabled={disabled}
              type="button"
              onClick={() => applyRatio(preset.w, preset.h)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlBlock}>
        <div className={styles.blockHeader}>
          <span>{language === "vi" ? "Kích thước ảnh" : "Image size"}</span>
        </div>
        <div className={styles.inputs}>
          <label>
            {t.controls.width}
            <span className={styles.inputWrap}>
              <input
                disabled={disabled}
                min={1}
                type="number"
                value={width ?? ""}
                onChange={(event) => onWidthChange(parseDimension(event.target.value))}
              />
              <span>px</span>
            </span>
          </label>
          <label>
            {t.controls.height}
            <span className={styles.inputWrap}>
              <input
                disabled={disabled}
                min={1}
                type="number"
                value={height ?? ""}
                onChange={(event) => onHeightChange(parseDimension(event.target.value))}
              />
              <span>px</span>
            </span>
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
      </div>

      <div className={styles.controlBlock}>
        <div className={styles.blockHeader}>
          <span>{language === "vi" ? "Lề quanh sản phẩm" : "Product padding"}</span>
          <strong>{paddingPercent}%</strong>
        </div>
        <label className={styles.range}>
          <span className={styles.srOnly}>{language === "vi" ? "Lề quanh sản phẩm" : "Product padding"}</span>
          <input
            disabled={disabled}
            max={30}
            min={0}
            type="range"
            value={paddingPercent}
            onChange={(event) => onPaddingChange(Number(event.target.value))}
          />
        </label>

      </div>

      <div className={styles.controlBlock}>
        <button className={styles.resetCrop} disabled={disabled} type="button" onClick={onCropReset}>
          {language === "vi" ? "Đặt lại khung crop" : "Reset crop"}
        </button>
      </div>
    </fieldset>
  );
}

function parseDimension(value: string): number | null {
  if (value === "") {
    return null;
  }

  return Number(value);
}
