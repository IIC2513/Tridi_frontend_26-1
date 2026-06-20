import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { useAuth } from "../context/useAuth";
import "./PWANavbar.css";

export default function PWANavbar({ searchValue = "", onSearchChange }) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    if (onSearchChange) onSearchChange(value);
  };

  const handleAccountOrLogout = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <header>
      <section className="containerNavbar">
        {/* Izquierda: Logo Tridi */}
        <nav className="navbar">
          <Link to="/" className="navbarLogo">
            <img src="/Tridi..svg" alt="Tridi" />
          </Link>
        </nav>

        {/* Centro: Mis Modelos + Barra de búsqueda */}
        <nav className="navbarList">
          <div className="navbarNav">
            <ul className="navList">
              <li>
                <button className="buttonNav" onClick={() => navigate("/")}>
                  <span className="box">Mis Modelos</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="pwaSearchBar">
            <MdSearch className="pwaSearchIcon" />
            <input
              type="text"
              className="pwaSearchInput"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar modelos..."
            />
          </div>
        </nav>

        {/* Derecha: Login/Logout */}
        <nav className="navbar">
          <button className="buttonMerc type1" onClick={handleAccountOrLogout}>
            <span className="btn-txt">
              {isAuthenticated ? "LOGOUT" : "LOGIN"}
            </span>
          </button>
        </nav>
      </section>
    </header>
  );
}
