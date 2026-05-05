import { Lock } from "lucide-react";
import { useI18n } from "../i18n";
import type { Language } from "../i18n";
import type { FitMode } from "../types";
import styles from "./ResizeControls.module.css";

const fitModes: FitMode[] = ["contain", "cover", "pad"];

const fitLabels: Record<FitMode, Record<Language, string>> = {
  contain: { en: "Fit inside", vi: "Vừa khung" },
  cover: { en: "Fill crop", vi: "Cắt đầy khung" },
  pad: { en: "Add padding", vi: "Thêm viền" },
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
      <div className={styles.segmented} role="group" aria-label={language === "vi" ? "Kiểu fit" : "Fit mode"}>
        {fitModes.map((mode) => (
          <button
            className={fitMode === mode ? styles.active : ""}
            disabled={disabled}
            key={mode}
            type="button"
            onClick={() => onFitModeChange(mode)}
          >
            {fitLabels[mode][language]}
          </button>
        ))}
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
