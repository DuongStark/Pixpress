import { AlertTriangle } from "lucide-react";
import styles from "./ErrorAlert.module.css";

type ErrorAlertProps = {
  message: string;
};

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className={styles.alert} role="alert">
      <AlertTriangle size={18} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
