import { MdSearch, MdClose } from "react-icons/md";
import "./FilterSidebar.css";

export default function FilterSidebar({ query, onQueryChange, filters, activeFilters, onToggleFilter }) {
  return (
    <aside className="filterSidebar">
      <div className="filterSearch">
        <MdSearch className="filterSearchIcon" />
        <input
          type="text"
          className="filterSearchInput"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for artists..."
        />
      </div>

      {activeFilters.length > 0 && (
        <div className="filterSection">
          <span className="filterLabel">ACTIVE</span>
          <div className="filterChips">
            {activeFilters.map((f) => (
              <button key={f} className="chip chipActive" onClick={() => onToggleFilter(f)}>
                {f} <MdClose className="chipClose" />
              </button>
            ))}
          </div>
        </div>
      )}

      {filters.map((group) => (
        <div key={group.label} className="filterSection">
          <span className="filterLabel">{group.label}</span>
          <div className="filterChips">
            {group.options.map((opt) => (
              <button
                key={opt}
                className={`chip ${activeFilters.includes(opt) ? "chipSelected" : ""}`}
                onClick={() => onToggleFilter(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}