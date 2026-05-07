import { Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Language } from "../i18n";
import { PlatformPreset, platformPresets } from "../lib/presets";
import { convertApiPresetToPlatformPreset, fetchPresets } from "../lib/api";
import styles from "./PresetSelector.module.css";

type PresetSelectorProps = {
  language: Language;
  selectedId: string;
  disabled?: boolean;
  onSelect: (preset: PlatformPreset) => void;
};

export default function PresetSelector({ language, selectedId, disabled = false, onSelect }: PresetSelectorProps) {
  const [presets, setPresets] = useState<PlatformPreset[]>(platformPresets);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPresets() {
      try {
        const apiPresets = await fetchPresets();
        const converted = apiPresets.map((preset) => convertApiPresetToPlatformPreset(preset, language));
        setPresets(converted);
      } catch (err) {
        console.warn("Failed to fetch presets from API, using local presets:", err);
        setError(language === "vi" ? "Đang dùng preset offline" : "Using offline presets");
      } finally {
        setLoading(false);
      }
    }

    loadPresets();
  }, [language]);

  const groups = useMemo(() => Array.from(new Set(presets.map((preset) => preset.group[language]))), [presets, language]);
  const selectedPreset = presets.find((preset) => preset.id === selectedId);
  const selectedGroup = selectedPreset?.group[language] ?? groups[0];
  const [activeGroup, setActiveGroup] = useState(selectedGroup);
  const visibleGroup = groups.includes(activeGroup) ? activeGroup : selectedGroup;

  if (loading) {
    return (
      <section className={styles.selector} aria-labelledby="preset-title">
        <div className={styles.titleRow}>
          <h2 id="preset-title">{language === "vi" ? "Nơi đăng" : "Publishing target"}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "20px" }}>
          <Loader2 className={styles.spinner} size={20} />
          <span>{language === "vi" ? "Đang tải preset..." : "Loading presets..."}</span>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.selector} aria-labelledby="preset-title">
      <div className={styles.titleRow}>
        <div>
          <h2 id="preset-title">{language === "vi" ? "Nơi đăng" : "Publishing target"}</h2>
          <p>
            {language === "vi"
              ? "Chọn nơi đăng để tự điền kích thước, định dạng và dung lượng phù hợp."
              : "Choose a target to fill the right size, format, and file-size goal."}
          </p>
          {error ? <p style={{ fontSize: "12px", color: "#888" }}>{error}</p> : null}
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
          {presets
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
    jpg: { en: "JPG: common photo format, small files, no transparency.", vi: "JPG: phổ biến, file nhẹ, không có nền trong suốt." },
    png: { en: "PNG: supports transparency, often heavier.", vi: "PNG: có nền trong suốt, thường nặng hơn." },
    webp: { en: "WEBP: modern web format with strong compression.", vi: "WEBP: định dạng web hiện đại, nén tốt." },
    avif: { en: "AVIF: very small files, slower and not accepted everywhere.", vi: "AVIF: file rất nhẹ, xử lý chậm và không phải nơi nào cũng nhận." },
  } as const;

  return text[format as keyof typeof text]?.[language] ?? format.toUpperCase();
}
