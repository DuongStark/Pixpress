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
        setError(language === "vi" ? "Đang dùng danh sách preset có sẵn" : "Using the built-in preset list");
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
          <h2 id="preset-title">{language === "vi" ? "Nơi đăng ảnh" : "Publishing destination"}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "20px" }}>
          <Loader2 className={styles.spinner} size={20} />
          <span>{language === "vi" ? "Đang tải danh sách preset..." : "Loading preset list..."}</span>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.selector} aria-labelledby="preset-title">
      <div className={styles.titleRow}>
        <div>
          <h2 id="preset-title">{language === "vi" ? "Nơi đăng ảnh" : "Publishing destination"}</h2>
          <p>
            {language === "vi"
              ? "Chọn nơi ảnh sẽ được sử dụng để áp dụng kích thước, định dạng và dung lượng phù hợp."
              : "Choose where the image will be used to apply the right size, format, and file-size target."}
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
                    <Check className={styles.checkIcon} data-visible={selected} size={16} aria-hidden="true" />
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
    jpg: { en: "JPG: widely supported photo format, smaller files, no transparency.", vi: "JPG: định dạng ảnh phổ biến, dung lượng nhẹ, không hỗ trợ nền trong suốt." },
    png: { en: "PNG: supports transparency, usually larger files.", vi: "PNG: hỗ trợ nền trong suốt, thường có dung lượng lớn hơn." },
    webp: { en: "WEBP: modern web format with efficient compression.", vi: "WEBP: định dạng web hiện đại, nén tốt và hiển thị đẹp." },
    avif: { en: "AVIF: very small files, slower to process and not accepted everywhere.", vi: "AVIF: dung lượng rất nhẹ, xử lý chậm hơn và chưa được mọi nơi hỗ trợ." },
  } as const;

  return text[format as keyof typeof text]?.[language] ?? format.toUpperCase();
}
