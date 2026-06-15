import { useRef, useEffect, useState } from "react";
import { getModelBlob } from "../../cache/modelCache";
import "./ModelViewer.css";

export default function ModelViewer({ src, alt = "3D model", cacheKey = src }) {
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

    let cancelled = false;
    let objectUrl = null;
    let el = null;
    const controller = new AbortController();

    (async () => {
      let resolvedSrc = src;

      try {
        const blob = await getModelBlob(src, cacheKey, {
          signal: controller.signal,
        });
        if (cancelled) {
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        resolvedSrc = objectUrl;
      } catch (e) {
        if (cancelled || e.name === "AbortError") return;
        resolvedSrc = src;
      }

      if (cancelled) {
        return;
      }

      el = document.createElement("model-viewer");
      el.setAttribute("src", resolvedSrc);
      el.setAttribute("alt", alt);
      el.setAttribute("auto-rotate", "");
      el.setAttribute("camera-controls", "");
      el.setAttribute("shadow-intensity", "1");
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.display = "block";
      container.appendChild(el);
      elRef.current = el;
    })();

    return () => {
      cancelled = true;
      controller.abort();
      if (el && container.contains(el)) container.removeChild(el);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      elRef.current = null;
    };
  }, [shouldMount, src, alt, cacheKey]);


  return <div ref={containerRef} className="modelViewer" />;
}