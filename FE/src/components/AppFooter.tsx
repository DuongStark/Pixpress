import { useI18n } from "../i18n";
import styles from "./AppFooter.module.css";

export default function AppFooter() {
  const { language } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <strong>Pixpress</strong>
          <span>{language === "vi" ? "Công cụ ảnh cho người bán online" : "Image tools for online sellers"}</span>
        </div>
        <nav className={styles.links} aria-label={language === "vi" ? "Liên kết cuối trang" : "Footer links"}>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=starkduong@gmail.com" target="_blank" rel="noreferrer">
            Contact
          </a>
          <span>Privacy</span>
          <span>Terms</span>
        </nav>
        <span className={styles.note}>
          {language === "vi" ? `Chạy trên trình duyệt - ${year}` : `Runs in your browser - ${year}`}
        </span>
      </div>
    </footer>
  );
}
