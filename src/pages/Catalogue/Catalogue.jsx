import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import SearchBar from "../../components/Searchbar/Searchbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import products from "../../data/products";
import "./Catalogue.css";

export default function Catalogue() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const haystack = `${p.name} ${p.artist} ${p.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <>
      <Navbar />
      <main className="cataloguePage">
        <header className="catalogueHeader">
          <h1 className="catalogueTitle">Catalogue</h1>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search models..."
          />
        </header>

        {visibleProducts.length === 0 ? (
          <p className="catalogueEmpty">No models match "{query}".</p>
        ) : (
          <section className="catalogueGrid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/catalogue/${product.id}`)}
              />
            ))}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}