import { Lock, Scan } from "lucide-react";
import { useI18n } from "../i18n";
import styles from "./ResizeControls.module.css";

type ResizeControlsProps = {
  width: number | null;
  height: number | null;
  keepAspectRatio: boolean;
  paddingPercent: number;
  centerProduct: boolean;
  disabled?: boolean;
  onWidthChange: (width: number | null) => void;
  onHeightChange: (height: number | null) => void;
  onKeepAspectRatioChange: (value: boolean) => void;
  onPaddingChange: (value: number) => void;
  onCenterProductChange: (value: boolean) => void;
  onCropReset: () => void;
};

export default function ResizeControls({
  width,
  height,
  keepAspectRatio,
  paddingPercent,
  centerProduct,
  disabled = false,
  onWidthChange,
  onHeightChange,
  onKeepAspectRatioChange,
  onPaddingChange,
  onCenterProductChange,
  onCropReset,
}: ResizeControlsProps) {
  const { language, t } = useI18n();

  return (
    <fieldset className={styles.fieldset}>
      <div className={styles.controlBlock}>
        <div className={styles.blockHeader}>
          <span>{language === "vi" ? "Kích thước ảnh" : "Image size"}</span>
        </div>
        <div className={styles.inputs}>
          <label>
            {t.controls.width}
            <span className={styles.inputWrap}>
              <input
                disabled={disabled}
                min={1}
                type="number"
                value={width ?? ""}
                onChange={(event) => onWidthChange(parseDimension(event.target.value))}
              />
              <span>px</span>
            </span>
          </label>
          <label>
            {t.controls.height}
            <span className={styles.inputWrap}>
              <input
                disabled={disabled}
                min={1}
                type="number"
                value={height ?? ""}
                onChange={(event) => onHeightChange(parseDimension(event.target.value))}
              />
              <span>px</span>
            </span>
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
      </div>

      <div className={styles.controlBlock}>
        <div className={styles.blockHeader}>
          <span>{language === "vi" ? "Lề quanh sản phẩm" : "Product padding"}</span>
          <strong>{paddingPercent}%</strong>
        </div>
        <label className={styles.range}>
          <span className={styles.srOnly}>{language === "vi" ? "Lề quanh sản phẩm" : "Product padding"}</span>
          <input
            disabled={disabled}
            max={30}
            min={0}
            type="range"
            value={paddingPercent}
            onChange={(event) => onPaddingChange(Number(event.target.value))}
          />
        </label>
        <label className={styles.checkbox}>
          <input
            checked={centerProduct}
            disabled={disabled}
            type="checkbox"
            onChange={(event) => onCenterProductChange(event.target.checked)}
          />
          <Scan size={16} aria-hidden="true" />
          {language === "vi" ? "Căn giữa sản phẩm" : "Center product"}
        </label>
      </div>

      <div className={styles.controlBlock}>
        <button className={styles.resetCrop} disabled={disabled} type="button" onClick={onCropReset}>
          {language === "vi" ? "Đặt lại khung crop" : "Reset crop"}
        </button>
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
