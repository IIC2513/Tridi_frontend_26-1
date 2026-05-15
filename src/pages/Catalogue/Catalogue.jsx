import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import FilterSidebar from "../../components/Filtersidebar/Filtersidebar";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getModels } from "../../api/models";
import ScrollProgressBar from "../../components/ScrollProgressBar/ScrollProgressBar";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    getModels()
      .then((data) => { if (!cancelled) setProducts(data); })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.error || "Couldn't load models.");
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
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
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
  }, [products, query, activeFilters, sortBy]);

  return (
    <>
      <Navbar />
      <ScrollProgressBar />
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
            <SortDropdown
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={setSortBy}
            />

            {loading ? (
              <p className="catalogueEmpty">Loading models…</p>
            ) : error ? (
              <p className="catalogueEmpty">{error}</p>
            ) : visibleProducts.length === 0 ? (
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
