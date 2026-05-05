import styles from "./PixpressLogo.module.css";

export default function PixpressLogo() {
  return (
    <span className={styles.logo} aria-hidden="true">
      <svg className={styles.mark} viewBox="0 0 88 88" focusable="false">
        <rect x="5" y="5" width="62" height="62" fill="var(--color-neutral)" stroke="var(--color-primary)" strokeWidth="4" />
        <rect x="14" y="16" width="44" height="8" fill="var(--color-primary)" />
        <rect x="17" y="34" width="38" height="24" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="3" />
        <path d="M22 54L30 44L37 52L43 45L52 54H22Z" fill="var(--color-tertiary)" />
        <rect x="45" y="39" width="6" height="6" fill="var(--color-primary)" />
        <path d="M63 34H80V40H63V34Z" fill="var(--color-tertiary)" />
        <path d="M63 48H80V54H63V48Z" fill="var(--color-tertiary)" />
        <path d="M76 28L86 37L76 46V28Z" fill="var(--color-tertiary)" />
        <path d="M76 42L86 51L76 60V42Z" fill="var(--color-tertiary)" />
      </svg>
      <span className={styles.wordGroup}>
        <span className={styles.wordmark}>Pixpress</span>
        <span className={styles.tagline}>Image pipeline</span>
      </span>
    </span>
  );
}
