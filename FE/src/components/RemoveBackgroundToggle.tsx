import { Scissors } from "lucide-react";
import { useI18n } from "../i18n";
import styles from "./RemoveBackgroundToggle.module.css";

type RemoveBackgroundToggleProps = {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export default function RemoveBackgroundToggle({
  checked,
  disabled = false,
  onChange,
}: RemoveBackgroundToggleProps) {
  const { t } = useI18n();

  return (
    <label className={styles.toggle}>
      <span>
        <Scissors size={16} aria-hidden="true" />
        {t.controls.removeBackground}
      </span>
      <input
        checked={checked}
        disabled={disabled}
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
