import { useI18n } from "../i18n";
import { UploadedImage } from "../types";
import { formatBytes, formatDimensions } from "../lib/format";
import styles from "./ImagePreview.module.css";

type ImagePreviewProps = {
  image: UploadedImage;
};

export default function ImagePreview({ image }: ImagePreviewProps) {
  const { t } = useI18n();

  return (
    <section className={styles.preview}>
      <div className={styles.previewHeader}>
        <span>{t.controls.originalPreview}</span>
        <span>{formatDimensions(image.width, image.height)}</span>
      </div>
      <div className={styles.imageFrame}>
        <img src={image.previewUrl} alt={image.originalName} />
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
