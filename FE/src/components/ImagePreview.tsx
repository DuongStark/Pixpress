import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import type { ProcessOptions, UploadedImage } from "../types";
import { formatBytes, formatDimensions } from "../lib/format";
import styles from "./ImagePreview.module.css";

type CropRect = ProcessOptions["crop"];
type CropAction = "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

type ImagePreviewProps = {
  image: UploadedImage;
  cropOptions?: Pick<ProcessOptions, "resize" | "crop">;
  compact?: boolean;
  renderedPreviewUrl?: string | null;
  renderedDimensions?: { width: number; height: number } | null;
  isRenderingPreview?: boolean;
  lockAspectRatio?: boolean;
  onCropChange?: (crop: CropRect) => void;
};

export default function ImagePreview({
  image,
  compact = false,
  cropOptions,
  renderedPreviewUrl,
  renderedDimensions,
  isRenderingPreview = false,
  lockAspectRatio = true,
  onCropChange,
}: ImagePreviewProps) {
  const { language, t } = useI18n();
  const cropBoxRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef<{ action: CropAction; x: number; y: number; crop: CropRect } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasCropOptions = Boolean(cropOptions) && Boolean(onCropChange);
  const [previewMode, setPreviewMode] = useState<"original" | "preview">(hasCropOptions ? "original" : "preview");
  const showRenderedPreview = Boolean(renderedPreviewUrl);
  const showPreviewImage = showRenderedPreview && previewMode === "preview";
  const showCropEditor = !showPreviewImage && hasCropOptions;

  useEffect(() => {
    if (!hasCropOptions) {
      setPreviewMode(showRenderedPreview ? "preview" : "original");
    }
  }, [showRenderedPreview, hasCropOptions]);

  const handlePointerDown = useCallback(
    (action: CropAction) => (event: React.PointerEvent<HTMLElement>) => {
      if (!cropOptions || !onCropChange) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStart.current = {
        action,
        x: event.clientX,
        y: event.clientY,
        crop: cropOptions.crop,
      };
      setIsDragging(true);
    },
    [cropOptions, onCropChange],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const start = dragStart.current;
      const box = cropBoxRef.current;
      if (!start || !box || !cropOptions || !onCropChange) {
        return;
      }

      const bounds = box.getBoundingClientRect();
      const dx = ((event.clientX - start.x) / bounds.width) * 100;
      const dy = ((event.clientY - start.y) / bounds.height) * 100;
      const targetRatio = getTargetRatio(cropOptions, image);
      const nextCrop =
        start.action === "move"
          ? moveCrop(start.crop, dx, dy)
          : resizeCrop(start.crop, dx, dy, start.action, lockAspectRatio ? targetRatio : null, image.width / image.height);

      onCropChange(nextCrop);
    },
    [cropOptions, image, lockAspectRatio, onCropChange],
  );

  const handlePointerUp = useCallback(() => {
    dragStart.current = null;
    setIsDragging(false);
  }, []);

  return (
    <section className={`${styles.preview} ${compact ? styles.compact : ""}`}>
      <div className={styles.previewHeader}>
        <div className={styles.previewTitle}>
          <span>{showPreviewImage ? (language === "vi" ? "Xem trước" : "Live preview") : showCropEditor ? t.controls.cropPreview : t.controls.originalPreview}</span>
          {showRenderedPreview ? (
            <div className={styles.previewToggle} role="radiogroup" aria-label={language === "vi" ? "Chế độ xem trước" : "Preview mode"}>
              <button aria-checked={previewMode === "original"} role="radio" type="button" onClick={() => setPreviewMode("original")}>
                {language === "vi" ? "Gốc" : "Original"}
              </button>
              <button aria-checked={previewMode === "preview"} role="radio" type="button" onClick={() => setPreviewMode("preview")}>
                Preview
              </button>
            </div>
          ) : null}
        </div>
        <span>{showPreviewImage && renderedDimensions ? formatDimensions(renderedDimensions.width, renderedDimensions.height) : formatDimensions(image.width, image.height)}</span>
      </div>
      <div className={showCropEditor ? styles.cropFrame : styles.imageFrame}>
        {showPreviewImage ? (
          <>
            <img src={renderedPreviewUrl || image.previewUrl} alt={image.originalName} />
            {isRenderingPreview ? <span className={styles.renderingBadge}>{language === "vi" ? "Đang cập nhật" : "Updating"}</span> : null}
          </>
        ) : showCropEditor && cropOptions ? (
          <div
            className={`${styles.cropStage} ${isDragging ? styles.dragging : ""}`}
            onPointerCancel={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div className={styles.cropBox} ref={cropBoxRef} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
              <img alt={image.originalName} draggable={false} src={image.previewUrl} />
              <div className={styles.cropShade} />
              <div
                className={styles.cropSelection}
                onPointerDown={handlePointerDown("move")}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                  height: `${cropOptions.crop.height}%`,
                  left: `${cropOptions.crop.x}%`,
                  top: `${cropOptions.crop.y}%`,
                  width: `${cropOptions.crop.width}%`,
                }}
              >
                <span className={`${styles.cropHandle} ${styles.nw}`} onPointerDown={handlePointerDown("nw")} />
                <span className={`${styles.cropHandle} ${styles.n}`} onPointerDown={handlePointerDown("n")} />
                <span className={`${styles.cropHandle} ${styles.ne}`} onPointerDown={handlePointerDown("ne")} />
                <span className={`${styles.cropHandle} ${styles.e}`} onPointerDown={handlePointerDown("e")} />
                <span className={`${styles.cropHandle} ${styles.se}`} onPointerDown={handlePointerDown("se")} />
                <span className={`${styles.cropHandle} ${styles.s}`} onPointerDown={handlePointerDown("s")} />
                <span className={`${styles.cropHandle} ${styles.sw}`} onPointerDown={handlePointerDown("sw")} />
                <span className={`${styles.cropHandle} ${styles.w}`} onPointerDown={handlePointerDown("w")} />
              </div>
            </div>
          </div>
        ) : (
          <img src={image.previewUrl} alt={image.originalName} />
        )}
      </div>
      <dl className={styles.metaGrid}>
        <div>
          <dt>{t.common.file}</dt>
          <dd>{image.originalName}</dd>
        </div>
        <div>
          <dt>{t.common.size}</dt>
          <dd>{formatBytes(image.size)}</dd>
        </div>
      </dl>
    </section>
  );
}

function getTargetRatio(options: Pick<ProcessOptions, "resize" | "crop">, image: UploadedImage): number {
  return (options.resize.width || image.width) / (options.resize.height || image.height);
}

function moveCrop(crop: CropRect, dx: number, dy: number): CropRect {
  return {
    ...crop,
    x: clamp(crop.x + dx, 0, 100 - crop.width),
    y: clamp(crop.y + dy, 0, 100 - crop.height),
  };
}

function resizeCrop(crop: CropRect, dx: number, dy: number, action: Exclude<CropAction, "move">, targetRatio: number | null, imageRatio: number): CropRect {
  const minSize = 10;
  let left = crop.x;
  let right = crop.x + crop.width;
  let top = crop.y;
  let bottom = crop.y + crop.height;

  const hasH = action.includes("w") || action.includes("e");
  const hasV = action.includes("n") || action.includes("s");

  if (action.includes("w")) left = clamp(left + dx, 0, right - minSize);
  if (action.includes("e")) right = clamp(right + dx, left + minSize, 100);
  if (action.includes("n")) top = clamp(top + dy, 0, bottom - minSize);
  if (action.includes("s")) bottom = clamp(bottom + dy, top + minSize, 100);

  let width = right - left;
  let height = bottom - top;

  if (targetRatio !== null) {
    // Determine which axis drives the resize
    const useWidthAsPrimary = hasH && (!hasV || Math.abs(dx) >= Math.abs(dy));

    if (useWidthAsPrimary) {
      height = (width * imageRatio) / targetRatio;
    } else {
      width = (height * targetRatio) / imageRatio;
    }

    // Clamp and re-derive if out of bounds
    if (height > 100) {
      height = 100;
      width = (height * targetRatio) / imageRatio;
    }
    if (width > 100) {
      width = 100;
      height = (width * imageRatio) / targetRatio;
    }

    // Anchor to the correct edge
    if (action.includes("w")) {
      left = right - width;
    } else {
      right = left + width;
    }

    if (action.includes("n")) {
      top = bottom - height;
    } else {
      bottom = top + height;
    }

    // Keep within bounds
    if (left < 0) { left = 0; right = width; }
    if (top < 0) { top = 0; bottom = height; }
    if (right > 100) { right = 100; left = 100 - width; }
    if (bottom > 100) { bottom = 100; top = 100 - height; }
  } else {
    width = clamp(width, minSize, 100);
    height = clamp(height, minSize, 100);
    left = clamp(left, 0, 100 - width);
    top = clamp(top, 0, 100 - height);
  }

  return { x: left, y: top, width, height };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
