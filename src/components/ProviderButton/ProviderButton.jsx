import { FaTwitch, FaGoogle, FaDiscord, FaGithub } from "react-icons/fa";
import "./ProviderButton.css";

const ICONS = {
  TWITCH: FaTwitch,
  GOOGLE: FaGoogle,
  DISCORD: FaDiscord,
  GITHUB: FaGithub,
};

export default function ProviderButton({ provider, onClick, disabled, loading }) {
  const Icon = ICONS[provider];
  const label = provider.charAt(0) + provider.slice(1).toLowerCase();

  return (
    <button
      type="button"
      className="providerBtn"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Continue with ${label}`}
      title={label}
    >
      {Icon ? <Icon size={20} /> : null}
      {loading && <span className="providerBtnDot" aria-hidden="true" />}
    </button>
  );
}