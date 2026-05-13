import { ArrowLeft, Crop, FileOutput, Layers3, Sparkles, SlidersHorizontal, Wand2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import BackgroundControls from "../components/BackgroundControls";
import ErrorAlert from "../components/ErrorAlert";
import FormatSelector from "../components/FormatSelector";
import ImagePreview from "../components/ImagePreview";
import LoadingButton from "../components/LoadingButton";
import OptimizationGoal from "../components/OptimizationGoal";
import QualitySlider from "../components/QualitySlider";
import ResizeControls from "../components/ResizeControls";
import { useI18n } from "../i18n";
import { processImageOnClient } from "../lib/clientImageProcessor";
import { estimateResultSize } from "../lib/estimate";
import { formatBytes } from "../lib/format";
import { platformPresets } from "../lib/presets";
import type { PlatformPreset } from "../lib/presets";
import { createJobFromClientResult, createMultiPlatformExport, getActiveImage } from "../lib/sessionStore";
import type { BackgroundMode, ImageFormat, OptimizationPriority, ProcessOptions } from "../types";
import styles from "./EditPage.module.css";

type EditMode = "platform" | "custom";

const ecommercePresetIds = [
  "shopee-product",
  "lazada-product",
  "tiktok-shop",
  "amazon-product",
  "ebay-product",
  "etsy-listing",
  "facebook-marketplace",
];

export default function EditPage() {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const image = useMemo(() => getActiveImage(), []);

  const [editMode, setEditMode] = useState<EditMode>("platform");
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);

  const initialPreset = platformPresets[0];
  const [selectedPreset, setSelectedPreset] = useState<PlatformPreset>(initialPreset);
  const [format, setFormat] = useState<ImageFormat>(initialPreset.format);
  const [quality, setQuality] = useState(Math.max(10, initialPreset.quality));
  const [qualityPreset, setQualityPreset] = useState<OptimizationPriority | null>(initialPreset.priority);
  const [width, setWidth] = useState<number | null>(image?.width || null);
  const [height, setHeight] = useState<number | null>(image?.height || null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [cropRect, setCropRect] = useState(() =>
    image ? getDefaultCropRect(image.width, image.height, image.width, image.height) : fullCropRect(),
  );
  const [maxSizeKb, setMaxSizeKb] = useState(initialPreset.maxSizeKb);
  const [priority, setPriority] = useState<OptimizationPriority>(initialPreset.priority);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>(initialPreset.backgroundMode);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [paddingPercent, setPaddingPercent] = useState(initialPreset.paddingPercent);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [livePreview, setLivePreview] = useState<{ url: string; width: number; height: number } | null>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [hoveredPlatformId, setHoveredPlatformId] = useState<string | null>(null);
  const [platformCropRects, setPlatformCropRects] = useState<Record<string, ProcessOptions["crop"]>>({});
  const livePreviewUrlRef = useRef<string | null>(null);
  const dimensionsInvalid = isInvalidDimension(width) || isInvalidDimension(height);

  useEffect(() => {
    if (!image || image.imageId !== imageId || editMode !== "custom" || dimensionsInvalid) {
      setIsRenderingPreview(false);
      setLivePreview((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        livePreviewUrlRef.current = null;
        return null;
      });
      return;
    }

    let cancelled = false;
    const options = createOptions();
    setIsRenderingPreview(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await processImageOnClient(image, options);
        if (cancelled) {
          URL.revokeObjectURL(result.previewUrl);
          return;
        }

        setLivePreview((previous) => {
          if (previous) URL.revokeObjectURL(previous.url);
          livePreviewUrlRef.current = result.previewUrl;
          return { url: result.previewUrl, width: result.width, height: result.height };
        });
      } catch (err) {
        console.warn("Failed to render live preview:", err);
      } finally {
        if (!cancelled) {
          setIsRenderingPreview(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    image,
    imageId,
    editMode,
    dimensionsInvalid,
    format,
    quality,
    width,
    height,
    keepAspectRatio,
    cropRect,
    maxSizeKb,
    priority,
    backgroundMode,
    backgroundColor,
    paddingPercent,
    selectedPreset,
    language,
  ]);

  useEffect(() => {
    return () => {
      if (livePreviewUrlRef.current) {
        URL.revokeObjectURL(livePreviewUrlRef.current);
      }
    };
  }, []);

  if (!image || image.imageId !== imageId) {
    return <Navigate to="/" replace />;
  }

  const activeImage = image;
  const aspectRatio = activeImage.width / activeImage.height;
  const currentOptions = createOptions();
  const estimatedSize = estimateResultSize(
    activeImage,
    currentOptions,
    currentOptions.resize.width ?? activeImage.width,
    currentOptions.resize.height ?? activeImage.height,
  );

  const ecommercePresets = platformPresets.filter((p) => ecommercePresetIds.includes(p.id));

  const activePlatformId = hoveredPlatformId ?? selectedPlatformIds[0];

  const platformCropRect = useMemo(() => {
    if (editMode !== "platform" || !activeImage) return null;
    const preset = ecommercePresets.find((p) => p.id === activePlatformId);
    if (!preset) return null;
    // Use saved crop if exists, otherwise compute default
    return platformCropRects[activePlatformId] ?? getDefaultCropRect(activeImage.width, activeImage.height, preset.width, preset.height);
  }, [editMode, activeImage, activePlatformId, platformCropRects, ecommercePresets]);

  function handlePlatformCropChange(crop: ProcessOptions["crop"]) {
    if (!activePlatformId) return;
    setPlatformCropRects((prev) => ({ ...prev, [activePlatformId]: crop }));
  }

  const platformEstimates = useMemo(() => {
    if (!activeImage) return new Map<string, number>();
    const map = new Map<string, number>();
    for (const preset of ecommercePresets) {
      const options: ProcessOptions = {
        format: preset.format,
        quality: preset.quality,
        resize: { width: preset.width, height: preset.height, keepAspectRatio: true, fitMode: preset.fitMode },
        crop: getDefaultCropRect(activeImage.width, activeImage.height, preset.width, preset.height),
        removeBackground: preset.removeBackground,
        goal: { maxSizeKb: preset.maxSizeKb, priority: preset.priority },
        background: { mode: preset.backgroundMode, color: "#ffffff", paddingPercent: preset.paddingPercent, centerProduct: true, softShadow: false },
        preset: { id: preset.id, name: preset.name.en },
      };
      map.set(preset.id, estimateResultSize(activeImage, options, preset.width, preset.height));
    }
    return map;
  }, [activeImage, ecommercePresets]);

  function togglePlatform(id: string) {
    if (selectedPlatformIds.includes(id)) {
      if (selectedPlatformIds.length === 1) return;
      setSelectedPlatformIds(selectedPlatformIds.filter((sid) => sid !== id));
    } else {
      setSelectedPlatformIds([...selectedPlatformIds, id]);
    }
  }

  function handlePresetSelect(preset: PlatformPreset) {
    setSelectedPreset(preset);
    setFormat(preset.format);
    setQuality(preset.quality);
    setQualityPreset(preset.priority);
    setWidth(preset.width || activeImage.width);
    setHeight(preset.height || activeImage.height);
    setCropRect(getDefaultCropRect(activeImage.width, activeImage.height, preset.width || activeImage.width, preset.height || activeImage.height));
    setMaxSizeKb(preset.maxSizeKb);
    setPriority(preset.priority);
    setBackgroundMode(preset.backgroundMode);
    setPaddingPercent(preset.paddingPercent);
  }  function handleQualityChange(nextQuality: number) {
    setQuality(Math.max(10, nextQuality));
    setQualityPreset(null);
    setPriority("smallest");
  }

  function handleQualityPresetChange(nextPriority: OptimizationPriority, nextQuality: number) {
    setPriority(nextPriority);
    setQuality(Math.max(10, nextQuality));
    setQualityPreset(nextPriority);
  }

  function handleBothChange(nextWidth: number, nextHeight: number) {
    setWidth(nextWidth);
    setHeight(nextHeight);
    setCropRect(getDefaultCropRect(activeImage.width, activeImage.height, nextWidth, nextHeight));
  }

  function handleWidthChange(nextWidth: number | null) {
    setWidth(nextWidth);
    if (keepAspectRatio && nextWidth && nextWidth > 0) {
      const nextHeight = Math.max(1, Math.round(nextWidth / aspectRatio));
      setHeight(nextHeight);
      setCropRect(getDefaultCropRect(activeImage.width, activeImage.height, nextWidth, nextHeight));
    } else if (nextWidth && height) {
      setCropRect(getDefaultCropRect(activeImage.width, activeImage.height, nextWidth, height));
    }
  }

  function handleHeightChange(nextHeight: number | null) {
    setHeight(nextHeight);
    if (keepAspectRatio && nextHeight && nextHeight > 0) {
      const nextWidth = Math.max(1, Math.round(nextHeight * aspectRatio));
      setWidth(nextWidth);
      setCropRect(getDefaultCropRect(activeImage.width, activeImage.height, nextWidth, nextHeight));
    } else if (width && nextHeight) {
      setCropRect(getDefaultCropRect(activeImage.width, activeImage.height, width, nextHeight));
    }
  }

  async function handleProcess() {
    setIsProcessing(true);
    setProcessError(null);

    try {
      if (editMode === "platform") {
        const exportJob = await createMultiPlatformExport(activeImage, selectedPlatformIds, createOptions());
        navigate(`/export/${exportJob.exportId}`);
        return;
      }

      if (dimensionsInvalid) return;

      const result = await processImageOnClient(activeImage, createOptions());
      const job = createJobFromClientResult(activeImage, createOptions(), result);
      navigate(`/result/${job.jobId}`);
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : t.errors.processImage);
    } finally {
      setIsProcessing(false);
    }
  }

  function createOptions(): ProcessOptions {
    return {
      format,
      quality,
      resize: { width, height, keepAspectRatio, fitMode: "cover" },
      crop: { x: cropRect.x, y: cropRect.y, width: cropRect.width, height: cropRect.height },
      removeBackground: false,
      goal: { maxSizeKb, priority },
      background: { mode: backgroundMode, color: backgroundColor, paddingPercent, centerProduct: true, softShadow: false },
      preset:
        editMode === "custom"
          ? { id: "custom", name: language === "vi" ? "Tự chỉnh" : "Custom" }
          : { id: selectedPreset.id, name: selectedPreset.name[language] },
    };
  }

  function resetLayout() {
    setWidth(activeImage.width);
    setHeight(activeImage.height);
    setKeepAspectRatio(true);
    setCropRect(fullCropRect());
    setPaddingPercent(0);
  }

  function resetOutput() {
    setFormat(initialPreset.format);
    setQuality(initialPreset.quality);
    setQualityPreset(initialPreset.priority);
    setMaxSizeKb(initialPreset.maxSizeKb);
    setPriority(initialPreset.priority);
  }

  function resetBackground() {
    setBackgroundMode(initialPreset.backgroundMode);
    setBackgroundColor("#ffffff");
  }

  const canProcess = editMode === "platform" ? selectedPlatformIds.length > 0 : !dimensionsInvalid;
  const editTitle =
    editMode === "custom" ? (language === "vi" ? "Tùy chỉnh ảnh xuất" : "Customize export image") : t.edit.title;

  return (
    <section className="pageStack">
      <div className={`pageHeader ${styles.compactHeader}`}>
        <div>
          <span className="eyebrow">{t.edit.eyebrow}</span>
          <h1>{editTitle}</h1>
        </div>
      </div>

      <div className={styles.modeTabs} role="tablist" aria-label={language === "vi" ? "Chế độ xử lý" : "Processing mode"}>
        <button
          className={`${styles.modeTab} ${editMode === "platform" ? styles.modeTabActive : ""}`}
          role="tab"
          aria-selected={editMode === "platform"}
          type="button"
          onClick={() => setEditMode("platform")}
        >
          <Layers3 size={16} aria-hidden="true" />
          {t.edit.modePlatform}
        </button>
        <button
          className={`${styles.modeTab} ${editMode === "custom" ? styles.modeTabActive : ""}`}
          role="tab"
          aria-selected={editMode === "custom"}
          type="button"
          onClick={() => setEditMode("custom")}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          {t.edit.modeCustom}
        </button>
      </div>

      {editMode === "platform" ? (
        <div className={styles.editorGrid}>
          <div className={styles.previewColumn}>
            <ImagePreview
              image={activeImage}
              cropOptions={platformCropRect ? {
                resize: {
                  width: ecommercePresets.find(p => p.id === activePlatformId)?.width ?? activeImage.width,
                  height: ecommercePresets.find(p => p.id === activePlatformId)?.height ?? activeImage.height,
                  keepAspectRatio: true,
                  fitMode: "cover",
                },
                crop: platformCropRect,
              } : undefined}
              lockAspectRatio={true}
              onCropChange={handlePlatformCropChange}
            />
            <div className={styles.previewNote}>
              <Sparkles size={14} aria-hidden="true" />
              <span>{t.edit.platformNote}</span>
            </div>
          </div>

          <aside className={styles.panel}>
            <div className={styles.panelHeader}>
              <span>{t.edit.platformModeTitle}</span>
              <span>{selectedPlatformIds.length} {language === "vi" ? "sàn" : "platforms"}</span>
            </div>

            <div className={styles.platformDesc}>
              <p>{t.edit.platformModeDesc}</p>
            </div>

            <div className={styles.platformGrid}>
              {ecommercePresets.map((preset) => {
                const selected = selectedPlatformIds.includes(preset.id);
                const estimatedBytes = platformEstimates.get(preset.id) ?? 0;
                const estimatedKb = Math.round(estimatedBytes / 1024);
                const withinLimit = estimatedKb <= preset.maxSizeKb;
                return (
                  <button
                    key={preset.id}
                    className={`${styles.platformCard} ${selected ? styles.platformCardActive : ""}`}
                    disabled={isProcessing}
                    type="button"
                    onClick={() => togglePlatform(preset.id)}
                    onMouseEnter={() => setHoveredPlatformId(preset.id)}
                  >
                    <span className={styles.platformCardCheck} aria-hidden="true" />
                    <strong className={styles.platformCardName}>{preset.name[language]}</strong>
                    <span className={styles.platformCardSpec}>
                      {preset.width}×{preset.height} · {preset.format.toUpperCase()} · ≤{preset.maxSizeKb}KB
                    </span>
                    <span className={styles.platformCardBg}>
                      {language === "vi" ? "Ảnh vuông · Nền trắng" : "Square crop · White background"}
                    </span>
                    <span className={withinLimit ? styles.platformCardEstimateOk : styles.platformCardEstimateWarn}>
                      ~{estimatedKb}KB {withinLimit ? "✓" : "⚠"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={styles.comingSoonNote}>
              <span className={styles.comingSoonBadge}>{language === "vi" ? "Sắp có" : "Coming soon"}</span>
              <span>{t.edit.platformBgRemovalNote}</span>
            </div>

            {processError ? <ErrorAlert message={processError} /> : null}

            <div className={styles.actions}>
              <Link className={styles.secondaryAction} to="/">
                <ArrowLeft size={16} aria-hidden="true" />
                {t.common.back}
              </Link>
              <LoadingButton
                disabled={!canProcess}
                isLoading={isProcessing}
                loadingLabel={t.edit.platformProcessing}
                type="button"
                onClick={handleProcess}
              >
                <Wand2 size={18} aria-hidden="true" />
                {t.edit.platformProcessBtn}
              </LoadingButton>
            </div>
          </aside>
        </div>
      ) : (
        <div className={styles.editorGrid}>
          <div className={styles.previewColumn}>
            <ImagePreview
              cropOptions={currentOptions}
              image={activeImage}
              isRenderingPreview={isRenderingPreview}
              lockAspectRatio={keepAspectRatio}
              renderedDimensions={livePreview ? { width: livePreview.width, height: livePreview.height } : null}
              renderedPreviewUrl={livePreview?.url}
              onCropChange={setCropRect}
            />
            <div className={styles.quickStatus}>
              <div>
                <span>{t.edit.output}</span>
                <strong>{language === "vi" ? "Tự chỉnh" : "Custom"}</strong>
              </div>
              <div>
                <span>{t.common.dimensions}</span>
                <strong>
                  {width || activeImage.width} x {height || activeImage.height}
                </strong>
              </div>
              <div>
                <span>{t.edit.estimate}</span>
                <strong>{formatBytes(estimatedSize)}</strong>
              </div>
            </div>
          </div>

          <aside className={`${styles.panel} ${styles.customPanel}`}>
            <div className={styles.stepList}>
              <details className={styles.step} open>
                <summary className={styles.stepHeader}>
                  <span className={styles.stepIcon}>
                    <Crop size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <h2>{t.edit.stepLayout}</h2>
                    <p>{t.edit.layoutHelp}</p>
                  </div>
                  <button className={styles.sectionReset} disabled={isProcessing} type="button" onClick={(event) => {
                    event.preventDefault();
                    resetLayout();
                  }}>
                    ↺ {language === "vi" ? "Đặt lại" : "Reset"}
                  </button>
                </summary>
                <div className={styles.stepBody}>
                  <ResizeControls
                    disabled={isProcessing}
                    height={height}
                    keepAspectRatio={keepAspectRatio}
                    paddingPercent={paddingPercent}
                    originalWidth={activeImage.width}
                    originalHeight={activeImage.height}
                    width={width}
                    onCropReset={() => {
                      setCropRect(getDefaultCropRect(activeImage.width, activeImage.height, width || activeImage.width, height || activeImage.height));
                    }}
                    onHeightChange={handleHeightChange}
                    onBothChange={handleBothChange}
                    onKeepAspectRatioChange={setKeepAspectRatio}
                    onPaddingChange={setPaddingPercent}
                    onWidthChange={handleWidthChange}
                  />
                </div>
              </details>

              <details className={styles.step} open>
                <summary className={styles.stepHeader}>
                  <span className={styles.stepIcon}>
                    <FileOutput size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <h2>{t.edit.stepOutput}</h2>
                    <p>{t.edit.outputHelp}</p>
                  </div>
                  <button className={styles.sectionReset} disabled={isProcessing} type="button" onClick={(event) => {
                    event.preventDefault();
                    resetOutput();
                  }}>
                    ↺ {language === "vi" ? "Đặt lại" : "Reset"}
                  </button>
                </summary>
                <div className={styles.stepBody}>
                  <FormatSelector disabled={isProcessing} value={format} onChange={setFormat} />
                  <OptimizationGoal
                    activeQualityPreset={qualityPreset}
                    disabled={isProcessing}
                    estimatedSizeBytes={estimatedSize}
                    language={language}
                    maxSizeKb={maxSizeKb}
                    onManualQualitySelect={() => setQualityPreset(null)}
                    onMaxSizeChange={setMaxSizeKb}
                    onQualityPresetChange={handleQualityPresetChange}
                  >
                    <QualitySlider disabled={isProcessing} value={quality} onChange={handleQualityChange} />
                  </OptimizationGoal>
                </div>
              </details>

              <details className={styles.step} open>
                <summary className={styles.stepHeader}>
                  <span className={styles.stepIcon}>
                    <Layers3 size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <h2>{t.edit.stepBackground}</h2>
                    <p>{t.edit.backgroundHelp}</p>
                  </div>
                  <button className={styles.sectionReset} disabled={isProcessing} type="button" onClick={(event) => {
                    event.preventDefault();
                    resetBackground();
                  }}>
                    ↺ {language === "vi" ? "Đặt lại" : "Reset"}
                  </button>
                </summary>
                <div className={styles.stepBody}>
                  <BackgroundControls
                    color={backgroundColor}
                    disabled={isProcessing}
                    language={language}
                    mode={backgroundMode}
                    onColorChange={setBackgroundColor}
                    onModeChange={setBackgroundMode}
                  />
                  <div className={styles.featureBanner}>
                    <span>{t.edit.removeBackgroundLocked}</span>
                    <button disabled type="button">{language === "vi" ? "Đăng ký" : "Notify me"}</button>
                  </div>
                </div>
              </details>
            </div>

            {dimensionsInvalid ? <ErrorAlert message={t.edit.invalidDimensions} /> : null}
            {processError ? <ErrorAlert message={processError} /> : null}

            <div className={styles.actions}>
              <Link className={styles.secondaryAction} to="/">
                <ArrowLeft size={16} aria-hidden="true" />
                {t.common.back}
              </Link>
              <LoadingButton
                disabled={!canProcess}
                isLoading={isProcessing}
                loadingLabel={t.edit.processing}
                type="button"
                onClick={handleProcess}
              >
                <Wand2 size={18} aria-hidden="true" />
                {t.edit.process}
              </LoadingButton>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function isInvalidDimension(value: number | null): boolean {
  return value !== null && (!Number.isFinite(value) || value <= 0);
}

function fullCropRect() {
  return { x: 0, y: 0, width: 100, height: 100 };
}

function getDefaultCropRect(sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number) {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  if (sourceRatio > targetRatio) {
    const width = (targetRatio / sourceRatio) * 100;
    return { x: (100 - width) / 2, y: 0, width, height: 100 };
  }

  const height = (sourceRatio / targetRatio) * 100;
  return { x: 0, y: (100 - height) / 2, width: 100, height };
}
