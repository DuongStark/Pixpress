import { useI18n } from "../i18n";
import styles from "./QualitySlider.module.css";

type QualitySliderProps = {
  value: number;
  disabled?: boolean;
  onChange: (quality: number) => void;
};

export default function QualitySlider({ value, disabled = false, onChange }: QualitySliderProps) {
  const { language, t } = useI18n();

  return (
    <label className={styles.field}>
      <span className={styles.labelRow}>
        <span>{language === "vi" ? "Chất lượng" : t.common.quality}</span>
        <strong>{value}<span>/100</span></strong>
      </span>
      <input
        disabled={disabled}
        list="quality-marks"
        max={100}
        min={10}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <datalist id="quality-marks">
        <option value="60" />
        <option value="75" />
        <option value="90" />
      </datalist>
      <span className={styles.ticks} aria-hidden="true">
        <span>10</span>
        <span>60</span>
        <span>75</span>
        <span>90</span>
        <span>100</span>
      </span>
    </label>
  );
}
