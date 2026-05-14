import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import FilterSidebar from "../../components/Filtersidebar/Filtersidebar";
import ProductCard from "../../components/ProductCard/ProductCard";
import products from "../../data/products";
import "./Catalogue.css";

const FILTERS = [
  { label: "SOFTWARE", options: ["Zbrush", "Blender"] },
  { label: "STYLE",    options: ["Realistic", "Stylized", "Low-Poly"] },
];

const SORT_OPTIONS = [
  { value: "newest",    label: "NEWEST" },
  { value: "oldest",    label: "OLDEST" },
  { value: "priceAsc",  label: "PRICE: ASCENDING" },
  { value: "priceDesc", label: "PRICE: DESCENDING" },
];

export default function Catalogue() {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = (f) => {
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const visibleProducts = useMemo(() => {
    let result = products;
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((p) =>
        `${p.name} ${p.artist} ${p.tags.join(" ")}`.toLowerCase().includes(q)
      );
    }
    if (activeFilters.length > 0) {
      result = result.filter((p) =>
        activeFilters.every((f) =>
          p.tags.map((t) => t.toLowerCase()).includes(f.toLowerCase())
        )
      );
    }

    result = [...result];
    switch (sortBy) {
      case "oldest":
        result.reverse();
        break;
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return result;
  }, [query, activeFilters, sortBy]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;

  return (
    <>
      <Navbar />
      <main className="cataloguePage">
        <h1 className="catalogueTitle">Catalogue</h1>
        <div className="catalogueBody">
          <FilterSidebar
            query={query}
            onQueryChange={setQuery}
            filters={FILTERS}
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
          />
          <section className="catalogueMain">
            <div className="catalogueSort" ref={sortRef}>
              <span className="sortLabel">SORT BY</span>
              <div className="sortDropdown">
                <button
                  type="button"
                  className="sortToggle"
                  onClick={() => setSortOpen((o) => !o)}
                >
                  {currentSortLabel}
                  <span className="sortCaret">{sortOpen ? "▴" : "▾"}</span>
                </button>
                {sortOpen && (
                  <ul className="sortMenu">
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          type="button"
                          className={`sortOption ${
                            sortBy === opt.value ? "active" : ""
                          }`}
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortOpen(false);
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

            {visibleProducts.length === 0 ? (
              <p className="catalogueEmpty">No models found.</p>
            ) : (
              <div className="catalogueGrid">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/catalogue/${product.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
