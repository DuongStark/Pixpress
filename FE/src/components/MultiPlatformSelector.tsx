import { Check, Layers3 } from "lucide-react";
import type { Language } from "../i18n";
import { platformPresets } from "../lib/presets";
import styles from "./MultiPlatformSelector.module.css";

type MultiPlatformSelectorProps = {
  language: Language;
  selectedIds: string[];
  disabled?: boolean;
  onChange: (ids: string[]) => void;
};

const ecommerceIds = ["shopee-product", "lazada-product", "tiktok-shop"];

export default function MultiPlatformSelector({
  language,
  selectedIds,
  disabled = false,
  onChange,
}: MultiPlatformSelectorProps) {
  const presets = platformPresets.filter((preset) => ecommerceIds.includes(preset.id));

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) {
        return;
      }

      onChange(selectedIds.filter((selectedId) => selectedId !== id));
      return;
    }

    onChange([...selectedIds, id]);
  }

  return (
    <section className={styles.selector} aria-labelledby="platform-export-title">
      <div className={styles.header}>
        <Layers3 size={18} aria-hidden="true" />
        <div>
          <h2 id="platform-export-title">{language === "vi" ? "Xuất cho nhiều sàn" : "Multi-platform export"}</h2>
          <p>
            {language === "vi"
              ? "Chọn các nền tảng cần đăng. Pixpress sẽ tạo file riêng theo preset từng nền tảng."
              : "Choose platforms. Pixpress creates a separate output for each preset."}
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {presets.map((preset) => {
          const selected = selectedIds.includes(preset.id);

          return (
            <button
              className={`${styles.card} ${selected ? styles.active : ""}`}
              disabled={disabled}
              key={preset.id}
              type="button"
              onClick={() => toggle(preset.id)}
            >
              <span className={styles.cardTop}>
                <strong>{preset.name[language]}</strong>
                <span className={styles.check}>{selected ? <Check size={16} aria-hidden="true" /> : null}</span>
              </span>
              <span className={styles.meta}>
                {preset.width} x {preset.height}px
              </span>
              <span className={styles.meta}>
                {preset.format.toUpperCase()} / {preset.maxSizeKb}KB / {preset.backgroundMode === "white" ? "white" : preset.backgroundMode}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
