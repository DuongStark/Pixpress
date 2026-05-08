import { useCallback, useRef, useState } from "react";
import { useI18n } from "../i18n";
import type { ProcessOptions, UploadedImage } from "../types";
import { formatBytes, formatDimensions } from "../lib/format";
import styles from "./ImagePreview.module.css";

type CropRect = ProcessOptions["crop"];
type CropAction = "move" | "nw" | "ne" | "sw" | "se";

type ImagePreviewProps = {
  image: UploadedImage;
  cropOptions?: Pick<ProcessOptions, "resize" | "crop">;
  compact?: boolean;
  onCropChange?: (crop: CropRect) => void;
};

export default function ImagePreview({ image, compact = false, cropOptions, onCropChange }: ImagePreviewProps) {
  const { t } = useI18n();
  const cropBoxRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef<{ action: CropAction; x: number; y: number; crop: CropRect } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isCropMode = cropOptions?.resize.fitMode === "cover";

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
          : resizeCrop(start.crop, dx, dy, start.action, targetRatio, image.width / image.height);

      onCropChange(nextCrop);
    },
    [cropOptions, image, onCropChange],
  );

  const handlePointerUp = useCallback(() => {
    dragStart.current = null;
    setIsDragging(false);
  }, []);

  return (
    <section className={`${styles.preview} ${compact ? styles.compact : ""}`}>
      <div className={styles.previewHeader}>
        <span>{isCropMode ? t.controls.cropPreview : t.controls.originalPreview}</span>
        <span>{formatDimensions(image.width, image.height)}</span>
      </div>
      <div className={isCropMode ? styles.cropFrame : styles.imageFrame}>
        {isCropMode && cropOptions ? (
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
                <span className={`${styles.cropHandle} ${styles.ne}`} onPointerDown={handlePointerDown("ne")} />
                <span className={`${styles.cropHandle} ${styles.sw}`} onPointerDown={handlePointerDown("sw")} />
                <span className={`${styles.cropHandle} ${styles.se}`} onPointerDown={handlePointerDown("se")} />
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

function resizeCrop(crop: CropRect, dx: number, dy: number, action: Exclude<CropAction, "move">, targetRatio: number, imageRatio: number): CropRect {
  const minSize = 10;
  const left = crop.x;
  const right = crop.x + crop.width;
  const top = crop.y;
  const bottom = crop.y + crop.height;
  let nextLeft = left;
  let nextRight = right;
  let nextTop = top;
  let nextBottom = bottom;

  if (action.includes("w")) nextLeft = clamp(left + dx, 0, right - minSize);
  if (action.includes("e")) nextRight = clamp(right + dx, left + minSize, 100);
  if (action.includes("n")) nextTop = clamp(top + dy, 0, bottom - minSize);
  if (action.includes("s")) nextBottom = clamp(bottom + dy, top + minSize, 100);

  let width = nextRight - nextLeft;
  let height = (width * imageRatio) / targetRatio;

  if (height > 100 || nextTop + height > 100) {
    height = Math.min(100, 100 - nextTop);
    width = (height * targetRatio) / imageRatio;
  }

  if (action.includes("w")) {
    nextLeft = nextRight - width;
  } else {
    nextRight = nextLeft + width;
  }

  if (action.includes("n")) {
    nextTop = nextBottom - height;
  } else {
    nextBottom = nextTop + height;
  }

  nextLeft = clamp(nextLeft, 0, 100 - width);
  nextTop = clamp(nextTop, 0, 100 - height);

  return {
    x: nextLeft,
    y: nextTop,
    width,
    height,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
