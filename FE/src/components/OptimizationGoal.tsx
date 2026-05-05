import type { Language } from "../i18n";
import { OptimizationPriority } from "../types";
import styles from "./OptimizationGoal.module.css";

const priorities: OptimizationPriority[] = ["smallest", "balanced", "best"];

const priorityLabels: Record<OptimizationPriority, Record<Language, string>> = {
  smallest: { en: "Smallest", vi: "Nhẹ nhất" },
  balanced: { en: "Balanced", vi: "Cân bằng" },
  best: { en: "Best quality", vi: "Đẹp nhất" },
};

type OptimizationGoalProps = {
  language: Language;
  maxSizeKb: number;
  priority: OptimizationPriority;
  disabled?: boolean;
  onMaxSizeChange: (value: number) => void;
  onPriorityChange: (value: OptimizationPriority) => void;
};

export default function OptimizationGoal({
  language,
  maxSizeKb,
  priority,
  disabled = false,
  onMaxSizeChange,
  onPriorityChange,
}: OptimizationGoalProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend>{language === "vi" ? "Mục tiêu" : "Goal"}</legend>
      <label className={styles.inputLabel}>
        {language === "vi" ? "Dung lượng tối đa" : "Max file size"}
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
      <div className={styles.segmented} role="group" aria-label={language === "vi" ? "Ưu tiên" : "Priority"}>
        {priorities.map((option) => (
          <button
            className={option === priority ? styles.active : ""}
            disabled={disabled}
            key={option}
            type="button"
            onClick={() => onPriorityChange(option)}
          >
            {priorityLabels[option][language]}
          </button>
        ))}
      </div>
      <p>
        {language === "vi"
          ? `Pixpress sẽ cố đưa ảnh xuống dưới ${maxSizeKb}KB.`
          : `Pixpress will try to bring the image under ${maxSizeKb}KB.`}
      </p>
    </fieldset>
  );
}
