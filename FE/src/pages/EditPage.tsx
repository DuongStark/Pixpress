import { ArrowLeft, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import BackgroundControls from "../components/BackgroundControls";
import ErrorAlert from "../components/ErrorAlert";
import FormatSelector from "../components/FormatSelector";
import ImagePreview from "../components/ImagePreview";
import LoadingButton from "../components/LoadingButton";
import OptimizationGoal from "../components/OptimizationGoal";
import PresetSelector from "../components/PresetSelector";
import QualitySlider from "../components/QualitySlider";
import RemoveBackgroundToggle from "../components/RemoveBackgroundToggle";
import ResizeControls from "../components/ResizeControls";
import { useI18n } from "../i18n";
import { estimateResultSize } from "../lib/estimate";
import { formatBytes } from "../lib/format";
import { platformPresets } from "../lib/presets";
import type { PlatformPreset } from "../lib/presets";
import { createJob, getActiveImage } from "../lib/sessionStore";
import type { BackgroundMode, FitMode, ImageFormat, OptimizationPriority, ProcessOptions } from "../types";
import styles from "./EditPage.module.css";

export default function EditPage() {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const image = useMemo(() => getActiveImage(), []);
  const initialPreset = platformPresets[0];
  const [selectedPreset, setSelectedPreset] = useState<PlatformPreset>(initialPreset);
  const [format, setFormat] = useState<ImageFormat>(initialPreset.format);
  const [quality, setQuality] = useState(initialPreset.quality);
  const [width, setWidth] = useState<number | null>(initialPreset.width || image?.width || null);
  const [height, setHeight] = useState<number | null>(initialPreset.height || image?.height || null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [fitMode, setFitMode] = useState<FitMode>(initialPreset.fitMode);
  const [removeBackground, setRemoveBackground] = useState(initialPreset.removeBackground);
  const [maxSizeKb, setMaxSizeKb] = useState(initialPreset.maxSizeKb);
  const [priority, setPriority] = useState<OptimizationPriority>(initialPreset.priority);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>(initialPreset.backgroundMode);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [paddingPercent, setPaddingPercent] = useState(initialPreset.paddingPercent);
  const [centerProduct, setCenterProduct] = useState(true);
  const [softShadow, setSoftShadow] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!image || image.imageId !== imageId) {
    return <Navigate to="/" replace />;
  }

  const activeImage = image;
  const aspectRatio = activeImage.width / activeImage.height;
  const dimensionsInvalid = isInvalidDimension(width) || isInvalidDimension(height);
  const warning = getWarning(format, removeBackground, t);
  const currentOptions = createOptions();
  const estimatedSize = estimateResultSize(
    activeImage,
    currentOptions,
    currentOptions.resize.width ?? activeImage.width,
    currentOptions.resize.height ?? activeImage.height,
  );

  function handlePresetSelect(preset: PlatformPreset) {
    setSelectedPreset(preset);
    setFormat(preset.format);
    setQuality(preset.quality);
    setWidth(preset.width || activeImage.width);
    setHeight(preset.height || activeImage.height);
    setFitMode(preset.fitMode);
    setRemoveBackground(preset.removeBackground);
    setMaxSizeKb(preset.maxSizeKb);
    setPriority(preset.priority);
    setBackgroundMode(preset.backgroundMode);
    setPaddingPercent(preset.paddingPercent);
    setCenterProduct(preset.paddingPercent > 0 || preset.removeBackground);
    setSoftShadow(false);
  }

  function handleWidthChange(nextWidth: number | null) {
    setWidth(nextWidth);

    if (keepAspectRatio && nextWidth && nextWidth > 0) {
      setHeight(Math.max(1, Math.round(nextWidth / aspectRatio)));
    }
  }

  function handleHeightChange(nextHeight: number | null) {
    setHeight(nextHeight);

    if (keepAspectRatio && nextHeight && nextHeight > 0) {
      setWidth(Math.max(1, Math.round(nextHeight * aspectRatio)));
    }
  }

  async function handleProcess() {
    if (dimensionsInvalid) {
      return;
    }

    const options = createOptions();

    setIsProcessing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 550));
    const job = createJob(activeImage, options);
    navigate(`/result/${job.jobId}`);
  }

  function createOptions(): ProcessOptions {
    return {
      format,
      quality,
      resize: {
        width,
        height,
        keepAspectRatio,
        fitMode,
      },
      removeBackground,
      goal: {
        maxSizeKb,
        priority,
      },
      background: {
        mode: backgroundMode,
        color: backgroundColor,
        paddingPercent,
        centerProduct,
        softShadow,
      },
      preset: {
        id: selectedPreset.id,
        name: selectedPreset.name[language],
      },
    };
  }

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <span className="eyebrow">{t.edit.eyebrow}</span>
          <h1>{t.edit.title}</h1>
          <p>{t.edit.description}</p>
        </div>
        <div className="threadMeta" aria-label={t.edit.settings}>
          <span>
            {t.common.format} <strong>{format.toUpperCase()}</strong>
          </span>
          <span>
            {language === "vi" ? "Preset" : "Preset"} <strong>{selectedPreset.name[language]}</strong>
          </span>
          <span>
            {language === "vi" ? "Mục tiêu" : "Target"} <strong>{maxSizeKb}KB</strong>
          </span>
        </div>
      </div>

      <div className={styles.editorGrid}>
        <ImagePreview image={activeImage} />

        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>{language === "vi" ? "Chuẩn bị ảnh đăng" : "Publish setup"}</span>
            <span>{isProcessing ? t.common.running : t.common.ready}</span>
          </div>

          <div className={styles.sectionDivider}>
            <span>{language === "vi" ? "01 Preset" : "01 Preset"}</span>
          </div>
          <div className={styles.optionBlock}>
            <PresetSelector
              disabled={isProcessing}
              language={language}
              selectedId={selectedPreset.id}
              onSelect={handlePresetSelect}
            />
          </div>

          <div className={styles.sectionDivider}>
            <span>{language === "vi" ? "02 Mục tiêu" : "02 Goal"}</span>
          </div>
          <div className={styles.optionBlock}>
            <OptimizationGoal
              disabled={isProcessing}
              language={language}
              maxSizeKb={maxSizeKb}
              priority={priority}
              onMaxSizeChange={setMaxSizeKb}
              onPriorityChange={setPriority}
            />
          </div>

          <div className={styles.sectionDivider}>
            <span>{language === "vi" ? "03 Đầu ra" : "03 Output"}</span>
          </div>
          <div className={styles.optionBlock}>
            <FormatSelector disabled={isProcessing} value={format} onChange={setFormat} />
          </div>

          <div className={styles.optionBlock}>
            <QualitySlider
              disabled={isProcessing}
              estimatedSize={formatBytes(estimatedSize)}
              value={quality}
              onChange={setQuality}
            />
          </div>

          <div className={styles.optionBlock}>
            <ResizeControls
              disabled={isProcessing}
              fitMode={fitMode}
              height={height}
              keepAspectRatio={keepAspectRatio}
              width={width}
              onFitModeChange={setFitMode}
              onHeightChange={handleHeightChange}
              onKeepAspectRatioChange={setKeepAspectRatio}
              onWidthChange={handleWidthChange}
            />
          </div>

          {dimensionsInvalid ? <ErrorAlert message={t.edit.invalidDimensions} /> : null}

          <div className={styles.sectionDivider}>
            <span>{language === "vi" ? "04 Nền ảnh" : "04 Background"}</span>
          </div>
          <div className={`${styles.optionBlock} ${styles.featureBlock}`}>
            <RemoveBackgroundToggle
              checked={removeBackground}
              disabled={isProcessing}
              onChange={setRemoveBackground}
            />
          </div>

          <div className={styles.optionBlock}>
            <BackgroundControls
              centerProduct={centerProduct}
              color={backgroundColor}
              disabled={isProcessing}
              language={language}
              mode={backgroundMode}
              paddingPercent={paddingPercent}
              softShadow={softShadow}
              onCenterProductChange={setCenterProduct}
              onColorChange={setBackgroundColor}
              onModeChange={setBackgroundMode}
              onPaddingChange={setPaddingPercent}
              onSoftShadowChange={setSoftShadow}
            />
          </div>

          {warning ? <ErrorAlert message={warning} /> : null}

          <div className={styles.actions}>
            <Link className={styles.secondaryAction} to="/">
              <ArrowLeft size={16} aria-hidden="true" />
              {t.common.back}
            </Link>
            <LoadingButton
              disabled={dimensionsInvalid}
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
    </section>
  );
}

function isInvalidDimension(value: number | null): boolean {
  return value !== null && (!Number.isFinite(value) || value <= 0);
}

function getWarning(format: ImageFormat, removeBackground: boolean, t: ReturnType<typeof useI18n>["t"]): string | null {
  if (removeBackground && format === "jpg") {
    return t.edit.jpgTransparency;
  }

  if (format === "png") {
    return t.edit.pngCompression;
  }

  if (format === "avif") {
    return t.edit.avifSlow;
  }

  return null;
}
