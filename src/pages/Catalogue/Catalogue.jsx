import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import ProductCard from "../../components/ProductCard/ProductCard";
import products from "../../data/products";
import "./Catalogue.css";

const FILTERS = [
  { label: "SOFTWARE", options: ["Zbrush", "Blender"] },
  { label: "STYLE",    options: ["Realistic", "Stylized", "Low-Poly"] },
];

export default function Catalogue() {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const navigate = useNavigate();

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
        // tag acá = BlenderGLBRealistic
        `${p.name} ${p.artist} ${p.tags.join(" ")}`.toLowerCase().includes(q)
      );
    }

    if (activeFilters.length > 0) {
      result = result.filter((p) =>
        activeFilters.every((f) => p.tags.map((t) => t.toLowerCase()).includes(f.toLowerCase()))
      );
    }

    return result;
  }, [query, activeFilters]);

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
            <div className="catalogueSort">
              <span className="sortLabel">SORT BY</span>
              <span className="sortValue">NEWEST</span>
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