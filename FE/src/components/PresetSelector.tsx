import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import type { Language } from "../i18n";
import { PlatformPreset, platformPresets } from "../lib/presets";
import styles from "./PresetSelector.module.css";

type PresetSelectorProps = {
  language: Language;
  selectedId: string;
  disabled?: boolean;
  onSelect: (preset: PlatformPreset) => void;
};

export default function PresetSelector({ language, selectedId, disabled = false, onSelect }: PresetSelectorProps) {
  const groups = useMemo(() => Array.from(new Set(platformPresets.map((preset) => preset.group[language]))), [language]);
  const selectedPreset = platformPresets.find((preset) => preset.id === selectedId);
  const selectedGroup = selectedPreset?.group[language] ?? groups[0];
  const [activeGroup, setActiveGroup] = useState(selectedGroup);
  const visibleGroup = groups.includes(activeGroup) ? activeGroup : selectedGroup;

  return (
    <section className={styles.selector} aria-labelledby="preset-title">
      <div className={styles.titleRow}>
        <div>
          <h2 id="preset-title">{language === "vi" ? "Nơi đăng" : "Publishing target"}</h2>
          <p>{language === "vi" ? "Chọn preset để tự điền format, kích thước, nền và mục tiêu." : "Choose a preset to fill format, size, background, and target."}</p>
        </div>
      </div>

      <div className={styles.tabs} role="tablist" aria-label={language === "vi" ? "Nhóm preset" : "Preset groups"}>
        {groups.map((group) => (
          <button
            className={visibleGroup === group ? styles.activeTab : ""}
            disabled={disabled}
            key={group}
            role="tab"
            type="button"
            onClick={() => setActiveGroup(group)}
          >
            {group}
          </button>
        ))}
      </div>

      <div className={styles.group}>
        <div className={styles.grid}>
          {platformPresets
            .filter((preset) => preset.group[language] === visibleGroup)
            .map((preset) => {
              const selected = preset.id === selectedId;

              return (
                <button
                  className={`${styles.card} ${selected ? styles.active : ""}`}
                  disabled={disabled}
                  key={preset.id}
                  type="button"
                  onClick={() => onSelect(preset)}
                >
                  <span className={styles.cardTitle}>
                    {preset.name[language]}
                    {selected ? <Check size={16} aria-hidden="true" /> : null}
                  </span>
                  <span className={styles.cardSummary}>{preset.summary[language]}</span>
                  <span className={styles.cardMeta} title={getFormatTooltip(preset.format, language)}>
                    {preset.format.toUpperCase()} / {preset.width || "auto"}x{preset.height || "auto"} / {preset.maxSizeKb}KB
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function getFormatTooltip(format: string, language: Language): string {
  const text = {
    jpg: { en: "JPG: common photo format, small files, no transparency.", vi: "JPG: định dạng ảnh phổ biến, nhẹ, không hỗ trợ trong suốt." },
    png: { en: "PNG: supports transparency, often heavier.", vi: "PNG: hỗ trợ trong suốt, thường nặng hơn." },
    webp: { en: "WEBP: modern web format with strong compression.", vi: "WEBP: định dạng web hiện đại, nén tốt." },
    avif: { en: "AVIF: very small files, slower and not accepted everywhere.", vi: "AVIF: file rất nhẹ, xử lý chậm và không phải nơi nào cũng nhận." },
  } as const;

  return text[format as keyof typeof text]?.[language] ?? format.toUpperCase();
}
