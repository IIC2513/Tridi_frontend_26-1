import { useState, useEffect, useRef } from "react";
import "./SortDropdown.css";

export default function SortDropdown({ options, value, onChange, label = "SORT BY" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="catalogueSort" ref={ref}>
      <span className="sortLabel">{label}</span>
      <div className="sortDropdown">
        <button
          type="button"
          className="sortToggle"
          onClick={() => setOpen((o) => !o)}
        >
          {currentLabel}
          <span className="sortCaret">{open ? "▴" : "▾"}</span>
        </button>
        {open && (
          <ul className="sortMenu">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  className={`sortOption ${value === opt.value ? "active" : ""}`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}