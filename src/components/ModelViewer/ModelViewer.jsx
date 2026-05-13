import { useRef, useEffect, useState } from "react";
import "./ModelViewer.css";

export default function ModelViewer({ src, alt = "3D model" }) {
  const containerRef = useRef(null);
  const elRef = useRef(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          if (elRef.current) {
            elRef.current.setAttribute("auto-rotate", "");
          }
        } else if (elRef.current) {
          elRef.current.removeAttribute("auto-rotate");
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldMount) return;
    const container = containerRef.current;
    if (!container) return;

    const el = document.createElement("model-viewer");
    el.setAttribute("src", src);
    el.setAttribute("alt", alt);
    el.setAttribute("auto-rotate", "");
    el.setAttribute("camera-controls", "");
    el.setAttribute("shadow-intensity", "1");
    el.setAttribute("loading", "lazy");
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.display = "block";

    container.appendChild(el);
    elRef.current = el;

    return () => {
      if (container.contains(el)) container.removeChild(el);
      elRef.current = null;
    };
  }, [shouldMount, src, alt]);

  return <div ref={containerRef} className="modelViewer" />;
}