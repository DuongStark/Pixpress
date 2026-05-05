import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import styles from "./LoadingButton.module.css";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingLabel?: string;
};

export default function LoadingButton({
  children,
  disabled,
  isLoading = false,
  loadingLabel = "Loading...",
  ...props
}: LoadingButtonProps) {
  return (
    <button className={styles.button} disabled={disabled || isLoading} {...props}>
      {isLoading ? <Loader2 className={styles.spinner} size={18} aria-hidden="true" /> : null}
      {isLoading ? loadingLabel : children}
    </button>
  );
}
