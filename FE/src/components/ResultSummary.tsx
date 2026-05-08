import { useI18n } from "../i18n";
import { ProcessedJob } from "../types";
import { formatBytes, formatDimensions } from "../lib/format";
import styles from "./ResultSummary.module.css";

type ResultSummaryProps = {
  job: ProcessedJob;
};

export default function ResultSummary({ job }: ResultSummaryProps) {
  const { language, t } = useI18n();
  const reduction = Math.max(0, Math.round((1 - job.result.size / job.original.size) * 100));
  const goal = job.options.goal ?? { maxSizeKb: Math.ceil(job.result.size / 1024), priority: "balanced" };
  const background = job.options.background ?? {
    mode: "transparent",
    color: "#ffffff",
    paddingPercent: 0,
    centerProduct: false,
    softShadow: false,
  };
  const preset = job.options.preset ?? { id: "legacy", name: language === "vi" ? "Tự chỉnh" : "Custom" };
  const targetBytes = goal.maxSizeKb * 1024;
  const reachedGoal = job.result.size <= targetBytes;
  const originalFormat = formatFromMime(job.original.mimeType);
  const backgroundLabel = getBackgroundLabel(background.mode, language);

  return (
    <section className={styles.summary}>
      <h2>{t.result.details}</h2>
      <div className={`${styles.statusCard} ${reachedGoal ? styles.success : styles.warning}`}>
        <strong>{reachedGoal ? (language === "vi" ? "Ảnh đã sẵn đăng" : "Ready to publish") : language === "vi" ? "Cần giảm dung lượng" : "File size needs adjustment"}</strong>
        <span>
          {reachedGoal
            ? `${language === "vi" ? "Đạt yêu cầu" : "Meets requirement"}: ${formatBytes(job.result.size)} / ${goal.maxSizeKb}KB`
            : `${language === "vi" ? "Vượt giới hạn" : "Over limit"}: ${formatBytes(job.result.size)} / ${goal.maxSizeKb}KB`}
        </span>
      </div>
      <dl>
        <div>
          <dt>{language === "vi" ? "Preset" : "Preset"}</dt>
          <dd>{preset.name}</dd>
        </div>
        <div>
          <dt>{t.result.originalFile}</dt>
          <dd>{job.original.originalName}</dd>
        </div>
        <div>
          <dt>{t.result.originalSize}</dt>
          <dd>{formatBytes(job.original.size)}</dd>
        </div>
        <div>
          <dt>{t.result.originalDimensions}</dt>
          <dd>{formatDimensions(job.original.width, job.original.height)}</dd>
        </div>
        <div>
          <dt>{t.result.resultFile}</dt>
          <dd>{job.result.fileName}</dd>
        </div>
        <div>
          <dt>{t.result.resultSize}</dt>
          <dd>
            {formatBytes(job.original.size)} -&gt; {formatBytes(job.result.size)}
          </dd>
        </div>
        <div>
          <dt>{t.result.resultDimensions}</dt>
          <dd>
            {formatDimensions(job.original.width, job.original.height)} -&gt; {formatDimensions(job.result.width, job.result.height)}
          </dd>
        </div>
        <div>
          <dt>{language === "vi" ? "Định dạng" : "Format"}</dt>
          <dd>
            {originalFormat} -&gt; {job.result.format.toUpperCase()}
          </dd>
        </div>
        <div>
          <dt>{language === "vi" ? "Nền" : "Background"}</dt>
          <dd>{backgroundLabel}</dd>
        </div>
        <div className={styles.reduction}>
          <dt>{t.result.reduction}</dt>
          <dd>{reduction}%</dd>
        </div>
      </dl>
      <section className={styles.compliance}>
        <h3>{language === "vi" ? "Kiểm tra yêu cầu cơ bản" : "Basic requirements check"}</h3>
        <ul>
          <li className={styles.pass}>
            <span>{language === "vi" ? "Kích thước" : "Dimensions"}</span>
            <strong>{formatDimensions(job.result.width, job.result.height)}</strong>
          </li>
          <li className={styles.pass}>
            <span>{language === "vi" ? "Định dạng" : "Format"}</span>
            <strong>{job.result.format.toUpperCase()}</strong>
          </li>
          <li className={reachedGoal ? styles.pass : styles.fail}>
            <span>{language === "vi" ? "Dung lượng" : "File size"}</span>
            <strong>{reachedGoal ? language === "vi" ? "Đạt yêu cầu" : "Meets requirement" : language === "vi" ? "Vượt giới hạn" : "Over limit"}</strong>
          </li>
          <li className={styles.warningCheck}>
            <span>{language === "vi" ? "Nội dung ảnh" : "Image content"}</span>
            <strong>{language === "vi" ? "Kiểm tra sản phẩm, chữ và logo trước khi đăng" : "Check product, text, and logos before publishing"}</strong>
          </li>
        </ul>
      </section>
    </section>
  );
}

function formatFromMime(mimeType: string): string {
  if (mimeType === "image/jpeg") {
    return "JPG";
  }

  return mimeType.replace("image/", "").toUpperCase();
}

function getBackgroundLabel(mode: string, language: "en" | "vi"): string {
  const labels = {
    transparent: { en: "Transparent", vi: "Trong suốt" },
    white: { en: "White", vi: "Trắng" },
    "light-gray": { en: "Light gray", vi: "Xám nhạt" },
    custom: { en: "Custom color", vi: "Màu tùy chọn" },
  } as const;

  return labels[mode as keyof typeof labels]?.[language] ?? mode;
}
