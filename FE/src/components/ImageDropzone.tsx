import { Trash2, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useI18n } from "../i18n";
import { UploadedImage } from "../types";
import { formatBytes, formatDimensions } from "../lib/format";
import styles from "./ImageDropzone.module.css";

const maxFileSize = 10 * 1024 * 1024;
const acceptedMimeTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

type ImageDropzoneProps = {
  image: UploadedImage | null;
  disabled?: boolean;
  error: string | null;
  onFileSelected: (file: File) => void;
  onFileRejected: (message: string) => void;
  onRemove: () => void;
};

export default function ImageDropzone({
  image,
  disabled = false,
  error,
  onFileSelected,
  onFileRejected,
  onRemove,
}: ImageDropzoneProps) {
  const { language, t } = useI18n();
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: acceptedMimeTypes,
    disabled,
    maxFiles: 1,
    maxSize: maxFileSize,
    multiple: false,
    noClick: true,
    onDropAccepted: (files) => {
      const [file] = files;
      if (file) {
        onFileSelected(file);
      }
    },
    onDropRejected: (rejections) => {
      const firstError = rejections[0]?.errors[0];

      if (firstError?.code === "file-too-large") {
        onFileRejected(t.dropzone.tooLarge);
        return;
      }

      if (firstError?.code === "file-invalid-type") {
        onFileRejected(t.dropzone.unsupported);
        return;
      }

      onFileRejected(firstError?.message ?? t.dropzone.rejected);
    },
  });

  return (
    <section
      {...getRootProps({
        className: `${styles.dropzone} ${isDragActive ? styles.active : ""}`,
      })}
    >
      <input {...getInputProps()} />

      {image ? (
        <div className={styles.selectedFile}>
          <img src={image.previewUrl} alt={image.originalName} className={styles.thumbnail} />
          <div className={styles.fileMeta}>
            <span className={styles.fileName}>{image.originalName}</span>
            <span>{formatBytes(image.size)}</span>
            <span>{formatDimensions(image.width, image.height)}</span>
          </div>
          <button className={styles.iconButton} type="button" onClick={onRemove} aria-label={t.dropzone.remove}>
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Upload size={38} aria-hidden="true" />
          <p>{isDragActive ? (language === "vi" ? "Thả ảnh để bắt đầu" : "Drop image to start") : t.dropzone.drop}</p>
          <span>{t.dropzone.supports}</span>
          <button className={styles.chooseButton} type="button" disabled={disabled} onClick={open}>
            {t.dropzone.choose}
          </button>
        </div>
      )}

      {error ? <p className={styles.error}>{error}</p> : null}
    </section>
  );
}
