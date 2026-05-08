import { Download, Pencil, Plus } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import ResultSummary from "../components/ResultSummary";
import { useI18n } from "../i18n";
import { getJob } from "../lib/sessionStore";
import styles from "./ResultPage.module.css";

export default function ResultPage() {
  const { jobId } = useParams();
  const { language, t } = useI18n();
  const job = jobId ? getJob(jobId) : null;

  if (!jobId) {
    return <Navigate to="/" replace />;
  }

  if (!job) {
    return (
      <section className="pageStack">
        <div className="pageHeader">
          <div>
            <span className="eyebrow">{t.result.unavailable}</span>
            <h1>{t.result.expiredTitle}</h1>
            <p>{t.result.expiredText}</p>
          </div>
        </div>
        <ErrorAlert message={t.result.expiredError} />
        <Link className={styles.secondaryAction} to="/">
          <Plus size={16} aria-hidden="true" />
          {t.result.processAnother}
        </Link>
      </section>
    );
  }

  const reachedGoal = job.result.size <= (job.options.goal?.maxSizeKb ?? Number.POSITIVE_INFINITY) * 1024;

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <span className="eyebrow">{t.result.eyebrow}</span>
          <h1>{t.result.title}</h1>
          <p>{t.result.description}</p>
        </div>
        <div className="threadMeta" aria-label={t.result.status}>
          <span>
            {t.result.job} <strong>{job.jobId.slice(0, 10)}</strong>
          </span>
          <span>
            {t.common.format} <strong>{job.result.format.toUpperCase()}</strong>
          </span>
          <span>
            {t.common.status} <strong>{reachedGoal ? (language === "vi" ? "Sẵn đăng" : "Ready") : language === "vi" ? "Cần chỉnh" : "Needs edit"}</strong>
          </span>
        </div>
      </div>

      <div className={styles.resultGrid}>
        <section className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <span>{language === "vi" ? "So sánh trước / sau" : "Before / after"}</span>
            <span>{reachedGoal ? (language === "vi" ? "Ảnh đã sẵn đăng" : "Ready to publish") : language === "vi" ? "Cần giảm dung lượng" : "File size needs adjustment"}</span>
          </div>
          <div className={styles.beforeAfterGrid}>
            <figure className={styles.compareFrame}>
              <figcaption>{language === "vi" ? "Ảnh gốc" : "Before"}</figcaption>
              <div className={styles.imageFrame}>
                <img src={job.original.previewUrl} alt={job.original.originalName} />
              </div>
            </figure>
            <figure className={styles.compareFrame}>
              <figcaption>{language === "vi" ? "Kết quả" : "After"}</figcaption>
              <div className={styles.imageFrame}>
                <img src={job.result.previewUrl} alt={job.result.fileName} />
              </div>
            </figure>
          </div>
        </section>

        <aside className={styles.sidePanel}>
          <div className={styles.panelHeader}>
            <span>{t.result.downloadConsole}</span>
            <span>{t.common.complete}</span>
          </div>
          <ResultSummary job={job} />

          <div className={styles.actions}>
            <a className={styles.primaryAction} download={job.result.fileName} href={job.result.downloadUrl}>
              <Download size={18} aria-hidden="true" />
              {t.result.download}
            </a>
            <Link className={styles.secondaryAction} to={`/edit/${job.imageId}`}>
              <Pencil size={16} aria-hidden="true" />
              {t.result.editAgain}
            </Link>
            <Link className={styles.secondaryAction} to="/">
              <Plus size={16} aria-hidden="true" />
              {t.result.processAnother}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
