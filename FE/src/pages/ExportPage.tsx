import { Download, Pencil, Plus } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import { useI18n } from "../i18n";
import { formatBytes, formatDimensions } from "../lib/format";
import { getExport } from "../lib/sessionStore";
import type { ComplianceLevel, MultiPlatformExport } from "../types";
import styles from "./ExportPage.module.css";

export default function ExportPage() {
  const { exportId } = useParams();
  const { language } = useI18n();
  const exportJob = exportId ? getExport(exportId) : null;

  if (!exportId) {
    return <Navigate to="/" replace />;
  }

  if (!exportJob) {
    return (
      <section className="pageStack">
        <div className="pageHeader">
          <div>
            <span className="eyebrow">{language === "vi" ? "Không tìm thấy" : "Unavailable"}</span>
            <h1>{language === "vi" ? "Kết quả đã hết hạn" : "Export expired"}</h1>
            <p>{language === "vi" ? "Hãy tải lại ảnh và xử lý lại." : "Upload the image again and rerun export."}</p>
          </div>
        </div>
        <ErrorAlert message={language === "vi" ? "Không tìm thấy export này trong phiên hiện tại." : "Export not found in this session."} />
      </section>
    );
  }

  const passedCount = exportJob.variants.filter((variant) => variant.goalPassed).length;

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <span className="eyebrow">{language === "vi" ? "Xuất nhiều nền tảng" : "Multi-platform export"}</span>
          <h1>{language === "vi" ? "Các ảnh đã sẵn sàng để kiểm tra" : "Platform variants are ready"}</h1>
          <p>
            {language === "vi"
              ? "Mỗi nền tảng có file riêng theo preset. Tải ZIP hoặc tải từng ảnh nếu chỉ cần một sàn."
              : "Each platform has its own preset output. Download ZIP or download individual files."}
          </p>
        </div>
        <div className="threadMeta" aria-label="Export status">
          <span>
            {language === "vi" ? "Nền tảng" : "Platforms"} <strong>{exportJob.variants.length}</strong>
          </span>
          <span>
            {language === "vi" ? "Đạt target" : "Targets hit"} <strong>{passedCount}</strong>
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
            <span>{formatDimensions(exportJob.original.width, exportJob.original.height)}</span>
          </div>
          <div className={styles.imageFrame}>
            <img src={exportJob.original.previewUrl} alt={exportJob.original.originalName} />
          </div>
        </section>

        <aside className={styles.sidePanel}>
          <div className={styles.panelHeader}>
            <span>{language === "vi" ? "Gói tải xuống" : "Download package"}</span>
            <span>{formatBytes(totalSize(exportJob))}</span>
          </div>
          <a className={styles.primaryAction} download="pixpress-export.zip" href={exportJob.zipDownloadUrl}>
            <Download size={18} aria-hidden="true" />
            {language === "vi" ? "Tải ZIP" : "Download ZIP"}
          </a>
          <Link className={styles.secondaryAction} to={`/edit/${exportJob.imageId}`}>
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
          <span>{language === "vi" ? "Kết quả theo nền tảng" : "Platform outputs"}</span>
          <span>{language === "vi" ? "Rule chắc + cảnh báo MVP" : "Hard checks + MVP warnings"}</span>
        </div>
        <div className={styles.variantGrid}>
          {exportJob.variants.map((variant) => (
            <article className={styles.variantCard} key={variant.variantId}>
              <div className={styles.variantImage}>
                <img src={variant.result.previewUrl} alt={variant.result.fileName} />
              </div>
              <div className={styles.variantBody}>
                <div className={styles.variantTitle}>
                  <h2>{variant.platform}</h2>
                  <span className={variant.goalPassed ? styles.badgeReview : styles.badgeFail}>
                    {variant.goalPassed
                      ? language === "vi"
                        ? "Cần kiểm tra"
                        : "Review"
                      : language === "vi"
                        ? "Chưa đạt"
                        : "Failed"}
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
                </dl>
                <ul className={styles.checkList}>
                  {variant.compliance.checks.map((check) => (
                    <li className={levelClass(check.level)} key={check.code}>
                      <span>{check.label}</span>
                      <strong>{check.message}</strong>
                    </li>
                  ))}
                </ul>
                <a className={styles.downloadOne} download={variant.result.fileName} href={variant.result.downloadUrl}>
                  <Download size={16} aria-hidden="true" />
                  {language === "vi" ? `Tải ảnh ${variant.platform}` : `Download ${variant.platform}`}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
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
