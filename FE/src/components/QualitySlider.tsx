import { useI18n } from "../i18n";
import styles from "./QualitySlider.module.css";

type QualitySliderProps = {
  value: number;
  estimatedSize?: string;
  disabled?: boolean;
  onChange: (quality: number) => void;
};

export default function QualitySlider({ value, estimatedSize, disabled = false, onChange }: QualitySliderProps) {
  const { language, t } = useI18n();

  return (
    <label className={styles.field}>
      <span>
        {t.common.quality} <strong>{value}</strong>
      </span>
      {estimatedSize ? (
        <span className={styles.estimate}>
          {language === "vi" ? "Ước tính đầu ra" : "Estimated output"} <strong>{estimatedSize}</strong>
        </span>
      ) : null}
      <input
        disabled={disabled}
        max={100}
        min={1}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
