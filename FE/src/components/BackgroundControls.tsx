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
  softShadow: boolean;
  disabled?: boolean;
  onModeChange: (value: BackgroundMode) => void;
  onColorChange: (value: string) => void;
  onSoftShadowChange: (value: boolean) => void;
};

export default function BackgroundControls({
  language,
  mode,
  color,
  softShadow,
  disabled = false,
  onModeChange,
  onColorChange,
  onSoftShadowChange,
}: BackgroundControlsProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend>{language === "vi" ? "Màu nền" : "Background color"}</legend>
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
      <label className={styles.toggle}>
        <span>
          <strong>{language === "vi" ? "Bóng nhẹ" : "Soft shadow"}</strong>
          <small>{language === "vi" ? "Tạo chiều sâu cho sản phẩm" : "Adds product depth"}</small>
        </span>
        <input
          checked={softShadow}
          disabled={disabled}
          type="checkbox"
          onChange={(event) => onSoftShadowChange(event.target.checked)}
        />
      </label>
    </fieldset>
  );
}
