import { useRef, useEffect } from "react";
import "./HeroModel.css";

export default function HeroModel({ src, alt = "3D model" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = document.createElement("model-viewer");

    el.setAttribute("src", src);
    el.setAttribute("alt", alt);

    el.setAttribute("camera-controls", "");
    el.setAttribute("auto-rotate", "");
    el.setAttribute("auto-rotate-delay", "0");
    el.setAttribute("rotation-per-second", "1deg");
    el.setAttribute("interaction-prompt", "none");
    el.setAttribute("disable-zoom", "");
    el.setAttribute("disable-pan", "");
    el.setAttribute("camera-target", "0m 0m 0m");

    el.setAttribute("environment-image", "neutral");
    el.setAttribute("exposure", "1.1");
    el.setAttribute("tone-mapping", "aces");
    el.setAttribute("shadow-intensity", "1.2");
    el.setAttribute("shadow-softness", "1");

    el.setAttribute("camera-orbit", "20deg 75deg 105%");
    el.setAttribute("field-of-view", "30deg");
    el.setAttribute("min-field-of-view", "30deg");
    el.setAttribute("max-field-of-view", "30deg");

    el.style.width = "100%";
    el.style.height = "100%";
    el.style.display = "block";
    el.style.backgroundColor = "transparent";

    containerRef.current.appendChild(el);
    return () => {
      if (containerRef.current?.contains(el)) {
        containerRef.current.removeChild(el);
      }
    };
  }, [src, alt]);

  return (
    <div className="heroModel">
      <div ref={containerRef} className="heroModelCanvas" />
      <div className="heroModelGlow" />
    </div>
  );
}