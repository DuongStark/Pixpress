import type { ReactNode } from "react";
import type { Language } from "../i18n";
import { OptimizationPriority } from "../types";
import { formatBytes } from "../lib/format";
import styles from "./OptimizationGoal.module.css";

const priorities: OptimizationPriority[] = ["smallest", "balanced", "best"];

const priorityLabels: Record<OptimizationPriority, Record<Language, string>> = {
  smallest: { en: "Smallest", vi: "Nhẹ nhất" },
  balanced: { en: "Balanced", vi: "Cân bằng" },
  best: { en: "Best quality", vi: "Đẹp nhất" },
};

const qualityValues: Record<OptimizationPriority, number> = {
  smallest: 60,
  balanced: 75,
  best: 90,
};

type OptimizationGoalProps = {
  language: Language;
  maxSizeKb: number;
  estimatedSizeBytes: number;
  activeQualityPreset: OptimizationPriority | null;
  disabled?: boolean;
  children?: ReactNode;
  onManualQualitySelect: () => void;
  onMaxSizeChange: (value: number) => void;
  onQualityPresetChange: (value: OptimizationPriority, quality: number) => void;
};

export default function OptimizationGoal({
  language,
  maxSizeKb,
  estimatedSizeBytes,
  activeQualityPreset,
  disabled = false,
  children,
  onManualQualitySelect,
  onMaxSizeChange,
  onQualityPresetChange,
}: OptimizationGoalProps) {
  const isOverLimit = estimatedSizeBytes > maxSizeKb * 1024;

  return (
    <fieldset className={styles.fieldset}>
      <div className={styles.group}>
        <span className={styles.groupLabel}>{language === "vi" ? "Mức chất lượng" : "Quality level"}</span>
        <div className={styles.segmented} role="group" aria-label={language === "vi" ? "Preset chất lượng" : "Quality presets"}>
          {priorities.map((option) => (
            <button
              className={option === activeQualityPreset ? styles.active : ""}
              disabled={disabled}
              key={option}
              type="button"
              onClick={() => onQualityPresetChange(option, qualityValues[option])}
            >
              {priorityLabels[option][language]}
              <span>Q {qualityValues[option]}</span>
            </button>
          ))}
          <button
            className={activeQualityPreset === null ? styles.active : ""}
            disabled={disabled}
            type="button"
            onClick={onManualQualitySelect}
          >
            {language === "vi" ? "Tuỳ chỉnh" : "Custom"}
            <span>{language === "vi" ? "Tự chọn" : "Manual"}</span>
          </button>
        </div>
        <p className={styles.helper}>
          {language === "vi"
            ? "Preset đặt slider chất lượng. Kéo slider sẽ chuyển sang Tuỳ chỉnh."
            : "Presets set the quality slider. Moving the slider switches to Custom."}
        </p>
      </div>

      {children}

      <label className={styles.inputLabel}>
        {language === "vi" ? "Dung lượng tối đa" : "Maximum file size"}
        <span className={styles.inputWrap}>
          <input
            disabled={disabled}
            min={10}
            max={20000}
            type="number"
            value={maxSizeKb}
            onChange={(event) => onMaxSizeChange(Math.min(20000, Math.max(10, Number(event.target.value) || 10)))}
          />
          <span>KB</span>
        </span>
      </label>
      <p className={`${styles.sizeStatus} ${isOverLimit ? styles.sizeStatusDanger : styles.sizeStatusOk}`}>
        <span aria-hidden="true">{isOverLimit ? "!" : "✓"}</span>
        {isOverLimit
          ? language === "vi"
            ? `Ước tính đầu ra: ${formatBytes(estimatedSizeBytes)} - vượt giới hạn`
            : `Estimated output: ${formatBytes(estimatedSizeBytes)} - over limit`
          : language === "vi"
            ? `Ước tính đầu ra: ${formatBytes(estimatedSizeBytes)} - trong giới hạn`
            : `Estimated output: ${formatBytes(estimatedSizeBytes)} - within limit`}
      </p>
    </fieldset>
  );
}
