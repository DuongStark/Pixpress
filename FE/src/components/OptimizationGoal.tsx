import type { Language } from "../i18n";
import { OptimizationPriority } from "../types";
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
  activeQualityPreset: OptimizationPriority | null;
  disabled?: boolean;
  onMaxSizeChange: (value: number) => void;
  onQualityPresetChange: (value: OptimizationPriority, quality: number) => void;
};

export default function OptimizationGoal({
  language,
  maxSizeKb,
  activeQualityPreset,
  disabled = false,
  onMaxSizeChange,
  onQualityPresetChange,
}: OptimizationGoalProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend>{language === "vi" ? "Dung lượng tối đa" : "Max file size"}</legend>
      <label className={styles.inputLabel}>
        {language === "vi" ? "Giới hạn dung lượng" : "File size limit"}
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
