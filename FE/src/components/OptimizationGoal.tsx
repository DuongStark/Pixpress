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
  onMaxSizeChange: (value: number) => void;
  onQualityPresetChange: (value: OptimizationPriority, quality: number) => void;
};

export default function OptimizationGoal({
  language,
  maxSizeKb,
  estimatedSizeBytes,
  activeQualityPreset,
  disabled = false,
  onMaxSizeChange,
  onQualityPresetChange,
}: OptimizationGoalProps) {
  const isOverLimit = estimatedSizeBytes > maxSizeKb * 1024;

  return (
    <fieldset className={styles.fieldset}>
      <label className={styles.inputLabel}>
        {language === "vi" ? "Dung lượng tối đa" : "Maximum file size"}
        <span>
          <input
            disabled={disabled}
            min={1}
            type="number"
            value={maxSizeKb}
            onChange={(event) => onMaxSizeChange(Math.max(1, Number(event.target.value) || 1))}
          />
          <strong>KB</strong>
        </span>
      </label>
      <p className={`${styles.sizeStatus} ${isOverLimit ? styles.sizeStatusDanger : styles.sizeStatusOk}`}>
        {isOverLimit
          ? language === "vi"
            ? `Ảnh ước tính ${formatBytes(estimatedSizeBytes)} - vượt giới hạn, hãy giảm quality.`
            : `Estimated ${formatBytes(estimatedSizeBytes)} - over limit, lower quality.`
          : language === "vi"
            ? `Ảnh ước tính ${formatBytes(estimatedSizeBytes)} - trong giới hạn.`
            : `Estimated ${formatBytes(estimatedSizeBytes)} - within limit.`}
      </p>
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
            <span>{qualityValues[option]}</span>
          </button>
        ))}
      </div>
      <p>
        {language === "vi"
          ? `Preset đặt slider chất lượng. Kéo slider để chỉnh tay và bỏ chọn preset. Mục tiêu: dưới ${maxSizeKb}KB.`
          : `Presets set the quality slider. Moving the slider switches to manual quality. Target: under ${maxSizeKb}KB.`}
      </p>
    </fieldset>
  );
}
