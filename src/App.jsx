import WebApp from "./WebApp";
import PWAApp from "./PWA/PWAApp";

export default function App() {
  const isPWA = window.location.pathname.startsWith("/pwa");

  return isPWA ? <PWAApp /> : <WebApp />;
}
