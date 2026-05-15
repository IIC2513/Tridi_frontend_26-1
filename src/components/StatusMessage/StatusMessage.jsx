import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaExclamation } from "react-icons/fa";
import "./StatusMessage.css";

const ICONS = {
  success: FaCheck,
  error: FaTimes,
  warning: FaExclamation,
};

const DEFAULT_TITLES = {
  success: "SUCCESS",
  error: "ERROR",
  warning: "WARNING",
};

export default function StatusMessage({
  variant = "success",
  title,
  message,
  duration = 4000,
  onDismiss,
}) {
  const [leaving, setLeaving] = useState(false);
  const Icon = ICONS[variant] || FaCheck;
  const displayTitle = title || DEFAULT_TITLES[variant];

  const close = () => {
    setLeaving(true);
    setTimeout(() => onDismiss?.(), 250);
  };

  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(close, duration);
    return () => clearTimeout(t);
  }, [duration]);

  return (
    <div
      className={`statusMsg statusMsg--${variant} ${leaving ? "statusMsg--leaving" : ""}`}
      role="status"
    >
      <button
        type="button"
        className="statusMsg__close"
        onClick={close}
        aria-label="Dismiss"
      >
        <FaTimes size={14} />
      </button>
      <div className="statusMsg__iconWrap">
        <Icon size={32} className="statusMsg__icon" />
      </div>
      <h2 className="statusMsg__title">{displayTitle}</h2>
      {message && <p className="statusMsg__message">{message}</p>}
    </div>
  );
}