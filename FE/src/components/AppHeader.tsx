import { RotateCcw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Language, useI18n } from "../i18n";
import PixpressLogo from "./PixpressLogo";
import styles from "./AppHeader.module.css";

export default function AppHeader() {
  const location = useLocation();
  const { language, setLanguage, t } = useI18n();

  return (
    <header className={styles.header}>
      <div className={styles.systemBar}>
        <span>PIXBOARD://IMAGE_PIPELINE</span>
        <span>SESSION: LOCAL MOCK</span>
      </div>
      <div className={styles.mainBar}>
        <Link to="/" className={styles.brand} aria-label={t.header.home}>
          <PixpressLogo />
        </Link>
        <nav className={styles.stepNav} aria-label={t.header.workflow}>
          <span className={location.pathname === "/" ? styles.currentStep : ""}>{t.header.upload}</span>
          <span className={location.pathname.startsWith("/edit") ? styles.currentStep : ""}>{t.header.edit}</span>
          <span className={location.pathname.startsWith("/result") ? styles.currentStep : ""}>{t.header.result}</span>
        </nav>
        <div className={styles.headerActions}>
          <div className={styles.languageSwitch} aria-label={t.header.language}>
            {(["en", "vi"] as Language[]).map((option) => (
              <button
                key={option}
                className={language === option ? styles.activeLanguage : ""}
                type="button"
                onClick={() => setLanguage(option)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
          {location.pathname !== "/" ? (
            <Link to="/" className={styles.resetLink}>
              <RotateCcw size={16} aria-hidden="true" />
              {t.header.newImage}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
