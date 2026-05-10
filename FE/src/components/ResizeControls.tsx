import { Check, Crop, Image, Lock, Scan } from "lucide-react";
import { useI18n } from "../i18n";
import type { Language } from "../i18n";
import type { FitMode } from "../types";
import styles from "./ResizeControls.module.css";

const fitModes: FitMode[] = ["contain", "cover", "pad"];

const fitLabels: Record<FitMode, Record<Language, string>> = {
  contain: { en: "Keep full image", vi: "Giữ đủ ảnh" },
  cover: { en: "Crop to frame", vi: "Cắt theo khung" },
  pad: { en: "Add background", vi: "Thêm nền" },
};

const fitDescriptions: Record<FitMode, Record<Language, string>> = {
  contain: {
    en: "Show the whole image. Empty edges may appear.",
    vi: "Hiển thị toàn bộ ảnh, có thể chừa viền trống.",
  },
  cover: {
    en: "Fill the frame. Extra edges will be cropped.",
    vi: "Lấp đầy khung, phần rìa thừa sẽ bị cắt.",
  },
  pad: {
    en: "Keep the image whole and fill empty space with background.",
    vi: "Giữ ảnh đầy đủ và lấp khoảng trống bằng nền.",
  },
};

const fitTooltips: Record<FitMode, Record<Language, string>> = {
  contain: { en: "Fit the whole image inside the frame.", vi: "Giữ trọn ảnh trong khung." },
  cover: { en: "Fill the frame by cropping overflow.", vi: "Lấp đầy khung bằng cách cắt phần thừa." },
  pad: { en: "Keep the image whole and fill empty space with background.", vi: "Giữ trọn ảnh và thêm nền vào khoảng trống." },
};

const fitIcons = {
  contain: Image,
  cover: Crop,
  pad: Scan,
};

type ResizeControlsProps = {
  width: number | null;
  height: number | null;
  keepAspectRatio: boolean;
  fitMode: FitMode;
  paddingPercent: number;
  centerProduct: boolean;
  disabled?: boolean;
  onWidthChange: (width: number | null) => void;
  onHeightChange: (height: number | null) => void;
  onKeepAspectRatioChange: (value: boolean) => void;
  onFitModeChange: (value: FitMode) => void;
  onPaddingChange: (value: number) => void;
  onCenterProductChange: (value: boolean) => void;
  onCropReset: () => void;
};

export default function ResizeControls({
  width,
  height,
  keepAspectRatio,
  fitMode,
  paddingPercent,
  centerProduct,
  disabled = false,
  onWidthChange,
  onHeightChange,
  onKeepAspectRatioChange,
  onFitModeChange,
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
        <div className={styles.blockHeader}>
          <span>{language === "vi" ? "Khi tỷ lệ ảnh khác khung" : "When image ratio differs"}</span>
        </div>
        <div className={styles.segmented} role="radiogroup" aria-label={language === "vi" ? "Cách canh ảnh" : "Image framing"}>
          {fitModes.map((mode) => {
            const Icon = fitIcons[mode];
            return (
              <button
                aria-checked={fitMode === mode}
                className={fitMode === mode ? styles.active : ""}
                disabled={disabled}
                key={mode}
                role="radio"
                title={fitTooltips[mode][language]}
                type="button"
                onClick={() => onFitModeChange(mode)}
              >
                <span className={styles.modeIcon}>
                  <Icon size={16} aria-hidden="true" />
                </span>
                <strong>{fitLabels[mode][language]}</strong>
                <Check className={styles.checkIcon} data-visible={fitMode === mode} size={15} aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <p className={styles.modeDescription}>{fitDescriptions[fitMode][language]}</p>
      </div>

      {fitMode === "cover" ? (
        <div className={styles.cropControls}>
          <button className={styles.resetCrop} disabled={disabled} type="button" onClick={onCropReset}>
            {language === "vi" ? "Đặt lại khung" : "Reset crop"}
          </button>
        </div>
      ) : null}
    </fieldset>
  );
}

function parseDimension(value: string): number | null {
  if (value === "") {
    return null;
  }

  return Number(value);
}
