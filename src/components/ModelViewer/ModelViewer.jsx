import { useRef, useEffect } from "react";
import "./ModelViewer.css";

export default function ModelViewer({ src, alt = "3D model" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = document.createElement("model-viewer");
    el.setAttribute("src", src);
    el.setAttribute("alt", alt);
    el.setAttribute("auto-rotate", "");
    el.setAttribute("camera-controls", "");
    el.setAttribute("shadow-intensity", "1");
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.display = "block";

    const container = containerRef.current;
    container.appendChild(el);

    return () => {
      container.removeChild(el);
    };
  }, [src, alt]);

  return <div ref={containerRef} className="modelViewer" />;
}