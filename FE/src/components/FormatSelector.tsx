import { FileImage, Image, Layers, Sparkles } from "lucide-react";
import { useI18n } from "../i18n";
import { ImageFormat } from "../types";
import styles from "./FormatSelector.module.css";

const formats: ImageFormat[] = ["jpg", "png", "webp", "avif"];

const formatIcons = {
  jpg: FileImage,
  png: Layers,
  webp: Image,
  avif: Sparkles,
};

type FormatSelectorProps = {
  value: ImageFormat;
  disabled?: boolean;
  onChange: (format: ImageFormat) => void;
};

export default function FormatSelector({ value, disabled = false, onChange }: FormatSelectorProps) {
  const { language, t } = useI18n();

  return (
    <fieldset className={styles.fieldset}>
      <legend>{t.controls.outputFormat}</legend>
      <div className={styles.segmented}>
        {formats.map((format) => {
          const Icon = formatIcons[format];

          return (
            <button
              key={format}
              className={value === format ? styles.active : ""}
              disabled={disabled}
              title={getFormatTooltip(format, language)}
              type="button"
              onClick={() => onChange(format)}
            >
              <Icon size={16} aria-hidden="true" />
              <strong>{format.toUpperCase()}</strong>
              <span>{getFormatHint(format, language)}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function getFormatHint(format: ImageFormat, language: "en" | "vi"): string {
  const text: Record<ImageFormat, Record<"en" | "vi", string>> = {
    jpg: { en: "Light, widely supported", vi: "Nhẹ, hỗ trợ rộng" },
    png: { en: "Supports transparency", vi: "Có nền trong suốt" },
    webp: { en: "Best balance", vi: "Cân bằng tốt nhất" },
    avif: { en: "Newest, smallest", vi: "Mới, nhỏ nhất" },
  };

  return text[format][language];
}

function getFormatTooltip(format: ImageFormat, language: "en" | "vi"): string {
  const text: Record<ImageFormat, Record<"en" | "vi", string>> = {
    jpg: { en: "JPG: common photo format, small files, no transparency.", vi: "JPG: phổ biến, file nhẹ, không có nền trong suốt." },
    png: { en: "PNG: supports transparency, often heavier.", vi: "PNG: có nền trong suốt, thường nặng hơn." },
    webp: { en: "WEBP: modern web format, good compression.", vi: "WEBP: định dạng web hiện đại, nén tốt." },
    avif: { en: "AVIF: very small files, slower and less universally accepted.", vi: "AVIF: file rất nhẹ, xử lý chậm hơn và không phải nơi nào cũng nhận." },
  };

  return text[format][language];
}
