import type { Language } from "../i18n";
import { BackgroundMode } from "../types";
import styles from "./BackgroundControls.module.css";

const backgroundModes: BackgroundMode[] = ["transparent", "white", "light-gray", "custom"];

const labels: Record<BackgroundMode, Record<Language, string>> = {
  transparent: { en: "Transparent", vi: "Trong suốt" },
  white: { en: "White", vi: "Trắng" },
  "light-gray": { en: "Light gray", vi: "Xám nhạt" },
  custom: { en: "Custom", vi: "Tùy chọn" },
};

type BackgroundControlsProps = {
  language: Language;
  mode: BackgroundMode;
  color: string;
  paddingPercent: number;
  centerProduct: boolean;
  softShadow: boolean;
  disabled?: boolean;
  onModeChange: (value: BackgroundMode) => void;
  onColorChange: (value: string) => void;
  onPaddingChange: (value: number) => void;
  onCenterProductChange: (value: boolean) => void;
  onSoftShadowChange: (value: boolean) => void;
};

export default function BackgroundControls({
  language,
  mode,
  color,
  paddingPercent,
  centerProduct,
  softShadow,
  disabled = false,
  onModeChange,
  onColorChange,
  onPaddingChange,
  onCenterProductChange,
  onSoftShadowChange,
}: BackgroundControlsProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend>{language === "vi" ? "Nền và padding" : "Background and padding"}</legend>
      <div className={styles.segmented}>
        {backgroundModes.map((option) => (
          <button
            className={mode === option ? styles.active : ""}
            disabled={disabled}
            key={option}
            type="button"
            onClick={() => onModeChange(option)}
          >
            {labels[option][language]}
          </button>
        ))}
      </div>
      {mode === "custom" ? (
        <label className={styles.colorRow}>
          {language === "vi" ? "Màu nền" : "Background color"}
          <input disabled={disabled} type="color" value={color} onChange={(event) => onColorChange(event.target.value)} />
        </label>
      ) : null}
      <label className={styles.range}>
        <span>
          {language === "vi" ? "Padding" : "Padding"} <strong>{paddingPercent}%</strong>
        </span>
        <input
          disabled={disabled}
          max={30}
          min={0}
          type="range"
          value={paddingPercent}
          onChange={(event) => onPaddingChange(Number(event.target.value))}
        />
      </label>
      <div className={styles.checks}>
        <label>
          <input
            checked={centerProduct}
            disabled={disabled}
            type="checkbox"
            onChange={(event) => onCenterProductChange(event.target.checked)}
          />
          {language === "vi" ? "Căn giữa sản phẩm" : "Center product"}
        </label>
        <label>
          <input
            checked={softShadow}
            disabled={disabled}
            type="checkbox"
            onChange={(event) => onSoftShadowChange(event.target.checked)}
          />
          {language === "vi" ? "Bóng nhẹ" : "Soft shadow"}
        </label>
      </div>
    </fieldset>
  );
}
