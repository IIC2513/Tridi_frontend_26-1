import PWAModelsSection from "./PWAModelsSection";
import "./PWAHome.css";

export default function PWAHome({ search = "" }) {
  return <PWAModelsSection search={search} />;
}
