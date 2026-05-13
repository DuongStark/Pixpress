import { Download, Pencil, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import ImagePreview from "../components/ImagePreview";
import { useI18n } from "../i18n";
import { processImageOnClient } from "../lib/clientImageProcessor";
import { formatBytes, formatDimensions, imageMimeType } from "../lib/format";
import { getActiveImage, getExport, saveExport } from "../lib/sessionStore";
import type { ComplianceLevel, ComplianceReport, ExportVariant, MultiPlatformExport, ProcessOptions, UploadedImage } from "../types";
import styles from "./ExportPage.module.css";

export default function ExportPage() {
  const { exportId } = useParams();
  const { language } = useI18n();
  const initialExport = useMemo(() => (exportId ? getExport(exportId) : null), [exportId]);
  const [currentExport, setCurrentExport] = useState<MultiPlatformExport | null>(initialExport);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editorCrop, setEditorCrop] = useState<ProcessOptions["crop"] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isScopePromptOpen, setIsScopePromptOpen] = useState(false);

  if (!exportId) {
    return <Navigate to="/" replace />;
  }

  if (!currentExport) {
    return (
      <section className="pageStack">
        <div className="pageHeader">
          <div>
            <span className="eyebrow">{language === "vi" ? "Không tìm thấy kết quả" : "Result unavailable"}</span>
            <h1>{language === "vi" ? "Kết quả không còn trong phiên này" : "This export is no longer available"}</h1>
            <p>{language === "vi" ? "Hãy tải lại ảnh gốc và tạo ảnh đầu ra mới." : "Upload the original image again and create a new export."}</p>
          </div>
        </div>
        <ErrorAlert message={language === "vi" ? "Không tìm thấy bộ ảnh đầu ra trong phiên hiện tại." : "This export could not be found in the current session."} />
      </section>
    );
  }

  const passedCount = currentExport.variants.filter((variant) => variant.goalPassed).length;
  const editingVariant = editingVariantId ? currentExport.variants.find((variant) => variant.variantId === editingVariantId) : null;
  const sourceImage = getProcessSourceImage(currentExport.original);

  function openVariantEditor(variant: ExportVariant) {
    if (!currentExport) return;
    const original = currentExport.original;
    setEditingVariantId(variant.variantId);
    setEditorCrop(
      variant.options.resize.fitMode === "cover"
        ? variant.options.crop
        : getDefaultCropRect(
          original.width,
          original.height,
          variant.options.resize.width || variant.result.width,
          variant.options.resize.height || variant.result.height,
        ),
    );
    setSaveError(null);
    setIsScopePromptOpen(false);
  }

  function closeEditor() {
    if (isSaving) return;
    setEditingVariantId(null);
    setEditorCrop(null);
    setSaveError(null);
    setIsScopePromptOpen(false);
  }

  async function handleSave(scope: "single" | "all") {
    if (!currentExport || !editingVariant || !editorCrop || !sourceImage) {
      return;
    }
    const exportSnapshot = currentExport;

    setIsSaving(true);
    setSaveError(null);

    try {
      const nextVariants = scope === "single"
        ? await rebuildSingleVariant(exportSnapshot, editingVariant.variantId, editorCrop, sourceImage)
        : await rebuildAllVariants(exportSnapshot, editorCrop, sourceImage);
      const nextExport: MultiPlatformExport = { ...exportSnapshot, variants: nextVariants };
      setCurrentExport(nextExport);
      saveExport(nextExport);
      closeEditor();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : language === "vi" ? "Không thể cập nhật ảnh này. Hãy thử lại với ảnh gốc." : "This image could not be updated. Try again with the original image.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <span className="eyebrow">{language === "vi" ? "Ảnh đầu ra theo sàn" : "Platform-ready images"}</span>
          <h1>{language === "vi" ? "Kiểm tra ảnh trước khi tải xuống" : "Review images before downloading"}</h1>
          <p>
            {language === "vi"
              ? "Mỗi sàn có một file riêng theo đúng kích thước, định dạng và dung lượng mục tiêu."
              : "Each platform has its own file with the required size, format, crop, and target weight."}
          </p>
        </div>
        <div className="threadMeta" aria-label="Export status">
          <span>
            {language === "vi" ? "Nền tảng" : "Platforms"} <strong>{currentExport.variants.length}</strong>
          </span>
          <span>
            {language === "vi" ? "Đạt yêu cầu" : "Ready"} <strong>{passedCount}</strong>
          </span>
          <span>
            ZIP <strong>{language === "vi" ? "Sẵn sàng" : "Ready"}</strong>
          </span>
        </div>
      </div>

      <div className={styles.exportGrid}>
        <section className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <span>{language === "vi" ? "Ảnh gốc" : "Original"}</span>
            <span>{formatDimensions(currentExport.original.width, currentExport.original.height)}</span>
          </div>
          <div className={styles.imageFrame}>
            <img src={currentExport.original.previewUrl} alt={currentExport.original.originalName} />
          </div>
        </section>

        <aside className={styles.sidePanel}>
          <div className={styles.panelHeader}>
            <span>{language === "vi" ? "Gói tải xuống" : "Download package"}</span>
            <span>{formatBytes(totalSize(currentExport))}</span>
          </div>
          <a className={styles.primaryAction} download="pixpress-export.zip" href={currentExport.zipDownloadUrl}>
            <Download size={18} aria-hidden="true" />
            {language === "vi" ? "Tải ZIP" : "Download ZIP"}
          </a>
          <Link className={styles.secondaryAction} to={`/edit/${currentExport.imageId}`}>
            <Pencil size={16} aria-hidden="true" />
            {language === "vi" ? "Chỉnh lại" : "Edit again"}
          </Link>
          <Link className={styles.secondaryAction} to="/">
            <Plus size={16} aria-hidden="true" />
            {language === "vi" ? "Ảnh khác" : "Another image"}
          </Link>
        </aside>
      </div>

      <section className={styles.variantsPanel}>
        <div className={styles.panelHeader}>
          <span>{language === "vi" ? "Ảnh theo từng sàn" : "Images by platform"}</span>
          <span>
            {language === "vi" ? "Tổng giảm" : "Total saved"}: {formatBytes(currentExport.variants.reduce((sum, v) => sum + Math.max(0, currentExport.original.size - v.result.size), 0))}
            {" "}{language === "vi" ? `cho ${currentExport.variants.length} sàn` : `across ${currentExport.variants.length} platforms`}
          </span>
        </div>
        <div className={styles.variantGrid}>
          {currentExport.variants.map((variant) => {
            const savedBytes = currentExport.original.size - variant.result.size;
            const savedPct = Math.round((savedBytes / currentExport.original.size) * 100);
            return (
            <article className={styles.variantCard} key={variant.variantId}>
              <div className={styles.variantImage}>
                <img src={variant.result.previewUrl} alt={variant.result.fileName} />
              </div>
              <div className={styles.variantBody}>
                <div className={styles.variantTitle}>
                  <h2>{variant.platform}</h2>
                  <span className={variant.goalPassed ? styles.badgeReview : styles.badgeFail}>
                    {variant.goalPassed ? (language === "vi" ? "Sẵn sàng tải" : "Ready") : language === "vi" ? "Cần chỉnh lại" : "Needs changes"}
                  </span>
                </div>
                <dl className={styles.metaList}>
                  <div>
                    <dt>{language === "vi" ? "File" : "File"}</dt>
                    <dd>{variant.result.fileName}</dd>
                  </div>
                  <div>
                    <dt>{language === "vi" ? "Kích thước" : "Size"}</dt>
                    <dd>{formatDimensions(variant.result.width, variant.result.height)}</dd>
                  </div>
                  <div>
                    <dt>{language === "vi" ? "Dung lượng" : "Weight"}</dt>
                    <dd>{formatBytes(variant.result.size)}</dd>
                  </div>
                  <div>
                    <dt>{language === "vi" ? "Format" : "Format"}</dt>
                    <dd>{variant.result.format.toUpperCase()}</dd>
                  </div>
                  <div>
                    <dt>{language === "vi" ? "So sánh" : "Savings"}</dt>
                    <dd className={savedBytes > 0 ? styles.savingsGood : styles.savingsNeutral}>
                      {formatBytes(currentExport.original.size)} → {formatBytes(variant.result.size)}
                      {savedBytes > 0 ? ` (-${savedPct}%)` : ""}
                    </dd>
                  </div>
                </dl>
                <ul className={styles.checkList}>
                  {variant.compliance.checks.map((check) => (
                    <li className={levelClass(check.level)} key={check.code}>
                      <span>{check.label}</span>
                      <strong>{check.message}</strong>
                    </li>
                  ))}
                </ul>
                <div className={styles.variantActions}>
                  <a className={styles.downloadOne} download={variant.result.fileName} href={variant.result.downloadUrl}>
                    <Download size={16} aria-hidden="true" />
                    {language === "vi" ? `Tải ảnh ${variant.platform}` : `Download ${variant.platform}`}
                  </a>
                  <button className={styles.editOne} type="button" onClick={() => openVariantEditor(variant)}>
                    <Pencil size={16} aria-hidden="true" />
                    {language === "vi" ? "Sửa ảnh" : "Edit image"}
                  </button>
                </div>
              </div>
            </article>
          );
          })}
        </div>
      </section>

      {editingVariant && editorCrop ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalPanel}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <strong>{language === "vi" ? "Chỉnh ảnh đầu ra" : "Edit output image"}</strong>
                <span>{editingVariant.platform}</span>
              </div>
              <button className={styles.closeModal} type="button" onClick={closeEditor}>
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.modalBody}>
              <ImagePreview
                compact
                cropOptions={{
                  resize: { ...editingVariant.options.resize, fitMode: "cover" },
                  crop: editorCrop,
                }}
                image={sourceImage || currentExport.original}
                onCropChange={setEditorCrop}
              />
              <div className={styles.modalMeta}>
                <span>
                  {language === "vi" ? "Kích thước đầu ra" : "Output size"}: {formatDimensions(editingVariant.result.width, editingVariant.result.height)}
                </span>
              </div>
              {saveError ? <ErrorAlert message={saveError} /> : null}
              {!sourceImage ? (
                <ErrorAlert
                  message={
                    language === "vi"
                      ? "Không còn file gốc trong phiên này. Hãy tải lại ảnh để chỉnh tiếp."
                      : "The original file is no longer available in this session. Re-upload it to continue editing."
                  }
                />
              ) : null}
            </div>

            <div className={styles.modalActions}>
              <button className={styles.secondaryAction} disabled={isSaving} type="button" onClick={closeEditor}>
                {language === "vi" ? "Đóng" : "Close"}
              </button>
              <button
                className={styles.primaryAction}
                disabled={isSaving || !sourceImage}
                type="button"
                onClick={() => setIsScopePromptOpen(true)}
              >
                {isSaving ? (language === "vi" ? "Đang lưu..." : "Saving...") : language === "vi" ? "Lưu" : "Save"}
              </button>
            </div>
            {isScopePromptOpen ? (
              <div className={styles.scopePrompt}>
                <strong>{language === "vi" ? "Áp dụng thay đổi cho ảnh nào?" : "Apply changes to which images?"}</strong>
                <div className={styles.scopeActions}>
                  <button
                    className={styles.secondaryAction}
                    disabled={isSaving}
                    type="button"
                    onClick={() => setIsScopePromptOpen(false)}
                  >
                    {language === "vi" ? "Hủy" : "Cancel"}
                  </button>
                  <button
                    className={styles.secondaryAction}
                    disabled={isSaving}
                    type="button"
                    onClick={() => handleSave("single")}
                  >
                    {language === "vi" ? "Chỉ ảnh này" : "Only this image"}
                  </button>
                  <button
                    className={styles.primaryAction}
                    disabled={isSaving}
                    type="button"
                    onClick={() => handleSave("all")}
                  >
                    {language === "vi" ? "Tất cả ảnh" : "All images"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function getProcessSourceImage(original: MultiPlatformExport["original"]): UploadedImage | null {
  const activeImage = getActiveImage();
  if (activeImage?.imageId === original.imageId && activeImage.file) {
    return activeImage;
  }
  return null;
}

async function rebuildSingleVariant(
  exportJob: MultiPlatformExport,
  variantId: string,
  crop: ProcessOptions["crop"],
  sourceImage: UploadedImage,
): Promise<ExportVariant[]> {
  const nextVariants = [...exportJob.variants];
  const index = nextVariants.findIndex((variant) => variant.variantId === variantId);
  if (index < 0) return nextVariants;
  nextVariants[index] = await reprocessVariant(nextVariants[index], crop, sourceImage);
  return nextVariants;
}

async function rebuildAllVariants(
  exportJob: MultiPlatformExport,
  crop: ProcessOptions["crop"],
  sourceImage: UploadedImage,
): Promise<ExportVariant[]> {
  const nextVariants: ExportVariant[] = [];
  for (const variant of exportJob.variants) {
    nextVariants.push(await reprocessVariant(variant, crop, sourceImage));
  }
  return nextVariants;
}

async function reprocessVariant(
  variant: ExportVariant,
  crop: ProcessOptions["crop"],
  sourceImage: UploadedImage,
): Promise<ExportVariant> {
  const options: ProcessOptions = {
    ...variant.options,
    resize: { ...variant.options.resize, fitMode: "cover" },
    crop,
  };
  const result = await processImageOnClient(sourceImage, options);
  const goalPassed = result.size <= options.goal.maxSizeKb * 1024;

  return {
    ...variant,
    options,
    result: {
      fileName: variant.result.fileName,
      format: result.format,
      mimeType: result.mimeType || imageMimeType(result.format),
      size: result.size,
      width: result.width,
      height: result.height,
      previewUrl: result.previewUrl,
      downloadUrl: result.downloadUrl,
    },
    goalPassed,
    compliance: createCompliance(goalPassed, result.width, result.height, options.goal.maxSizeKb, result.format.toUpperCase()),
  };
}

function totalSize(exportJob: MultiPlatformExport): number {
  return exportJob.variants.reduce((sum, variant) => sum + variant.result.size, 0);
}

function levelClass(level: ComplianceLevel): string {
  if (level === "pass") {
    return styles.pass;
  }

  if (level === "fail") {
    return styles.fail;
  }

  return styles.warning;
}

function createCompliance(
  goalPassed: boolean,
  width: number,
  height: number,
  maxSizeKb: number,
  format: string,
): ComplianceReport {
  return {
    status: goalPassed ? "needs_review" : "failed",
    checks: [
      {
        code: "DIMENSIONS",
        level: "pass",
        label: "Kích thước",
        message: `${width} x ${height}px`,
      },
      {
        code: "FILE_SIZE",
        level: goalPassed ? "pass" : "fail",
        label: "Dung lượng",
        message: goalPassed ? `Dưới mục tiêu ${maxSizeKb}KB` : `Vượt mục tiêu ${maxSizeKb}KB`,
      },
      {
        code: "FORMAT",
        level: "pass",
        label: "Định dạng",
        message: format,
      },
    ],
  };
}

function getDefaultCropRect(sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number): ProcessOptions["crop"] {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  if (sourceRatio > targetRatio) {
    const width = (targetRatio / sourceRatio) * 100;
    return { x: (100 - width) / 2, y: 0, width, height: 100 };
  }

  const height = (sourceRatio / targetRatio) * 100;
  return { x: 0, y: (100 - height) / 2, width: 100, height };
}
