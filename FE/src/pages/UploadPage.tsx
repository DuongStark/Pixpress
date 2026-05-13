import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageDropzone from "../components/ImageDropzone";
import LoadingButton from "../components/LoadingButton";
import { useI18n } from "../i18n";
import { formatBytes, formatDimensions } from "../lib/format";
import { clearActiveImage, createLocalImage } from "../lib/sessionStore";
import { UploadedImage } from "../types";
import styles from "./UploadPage.module.css";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 10 * 1024 * 1024;

export default function UploadPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileSelected(file: File) {
    setError(null);

    if (!acceptedTypes.includes(file.type)) {
      setError(t.dropzone.unsupported);
      return;
    }

    if (file.size > maxFileSize) {
      setError(t.dropzone.tooLarge);
      return;
    }

    try {
      const localImage = await createLocalImage(file);
      if (image?.previewUrl) {
        URL.revokeObjectURL(image.previewUrl);
      }
      setImage(localImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.readImage);
    }
  }

  function handleRemove() {
    if (image?.previewUrl) {
      URL.revokeObjectURL(image.previewUrl);
    }
    clearActiveImage();
    setImage(null);
    setError(null);
  }

  async function handleContinue() {
    if (!image) {
      return;
    }

    setIsUploading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    navigate(`/edit/${image.imageId}`);
  }

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <span className="eyebrow">{t.upload.eyebrow}</span>
          <h1>{t.upload.title}</h1>
          <p className={styles.tagline}>{t.upload.tagline}</p>
          <p>{t.upload.description}</p>
        </div>
        <div className="threadMeta" aria-label={t.upload.uploadStatus}>
          <span>
            {t.common.status} <strong>{image ? t.common.queued : t.common.waiting}</strong>
          </span>
          <span>
            {t.upload.limit} <strong>10MB</strong>
          </span>
          <span>
            {t.upload.mode} <strong>{t.upload.singleFile}</strong>
          </span>
        </div>
      </div>

      <div className={styles.uploadBoard}>
        <div className={styles.dropzoneColumn}>
          <ImageDropzone
            disabled={isUploading}
            error={error}
            image={image}
            onFileRejected={setError}
            onFileSelected={handleFileSelected}
            onRemove={handleRemove}
          />
          <div className={styles.dropzoneHints}>
            <span className={styles.hintText}>
              {t.dropzone.supports}
            </span>
            <div className={styles.platformBadges}>
              <span>Shopee</span>
              <span>TikTok</span>
              <span>Instagram</span>
            </div>
          </div>
        </div>

        <aside className={styles.queuePanel}>
          <div className={styles.panelHeader}>
            <span>{t.upload.queue}</span>
            <span>{image ? t.common.ready : t.common.idle}</span>
          </div>
          <dl className={styles.queueList}>
            <div>
              <dt>{t.upload.fileName}</dt>
              <dd>{image?.originalName ?? t.upload.noFile}</dd>
            </div>
            <div>
              <dt>{t.upload.type}</dt>
              <dd>{image?.mimeType ?? "JPG / PNG / WEBP"}</dd>
            </div>
            <div>
              <dt>{t.common.size}</dt>
              <dd>{image ? formatBytes(image.size) : "0 B"}</dd>
            </div>
            <div>
              <dt>{t.common.dimensions}</dt>
              <dd>{image ? formatDimensions(image.width, image.height) : "0 x 0px"}</dd>
            </div>
          </dl>
          <div className={styles.badgeGrid} aria-label="Accepted formats">
            <span>JPG</span>
            <span>PNG</span>
            <span>WEBP</span>
          </div>
        </aside>
      </div>

      <div className={styles.actions}>
        <LoadingButton
          disabled={!image}
          isLoading={isUploading}
          loadingLabel={t.upload.uploading}
          type="button"
          onClick={handleContinue}
        >
          {t.upload.continue}
          <ArrowRight size={18} aria-hidden="true" />
        </LoadingButton>
      </div>

      <section className={styles.seoPanel} aria-labelledby="why-pixpress">
        <div>
          <span className="eyebrow">{t.upload.sellerWorkflow}</span>
          <h2 id="why-pixpress">{t.upload.seoTitle}</h2>
          <p>{t.upload.seoDescription}</p>
        </div>
        <div className={styles.featureGrid}>
          <article>
            <h3>{t.upload.featureCompressTitle}</h3>
            <p>{t.upload.featureCompressText}</p>
          </article>
          <article>
            <h3>{t.upload.featureConvertTitle}</h3>
            <p>{t.upload.featureConvertText}</p>
          </article>
          <article>
            <h3>{t.upload.featureResizeTitle}</h3>
            <p>{t.upload.featureResizeText}</p>
          </article>
        </div>
      </section>

      <section className={styles.faqPanel} aria-labelledby="faq-title">
        <div className={styles.panelHeader}>
          <span id="faq-title">{t.upload.faq}</span>
        </div>
        <div className={styles.faqGrid}>
          <article>
            <h3>{t.upload.faqFreeTitle}</h3>
            <p>{t.upload.faqFreeText}</p>
          </article>
          <article>
            <h3>{t.upload.faqFormatsTitle}</h3>
            <p>{t.upload.faqFormatsText}</p>
          </article>
          <article>
            <h3>{t.upload.faqProductTitle}</h3>
            <p>{t.upload.faqProductText}</p>
          </article>
        </div>
      </section>
    </section>
  );
}
