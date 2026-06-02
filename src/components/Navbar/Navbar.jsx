import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const scrollLeft = () => {
    const scroll = document.querySelector(".navbarNav");
    scroll.scrollLeft -= 200;
  };

  const scrollRight = () => {
    const scroll = document.querySelector(".navbarNav");
    scroll.scrollLeft += 200;
  };

  const requireAuth = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate("/login", { state: { from: path } });
    }
  };

  const handleCart = () => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      navigate("/login", { state: { from: "/cart" } });
    }
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
        <nav className="navbar">
          <Link to="/" className="navbarLogo">
            <img src="/Tridi..svg" alt="Tridi" />
          </Link>
        </nav>

        <nav className="navbarList">
          <button className="buttonArrow" onClick={scrollLeft}>
            <img src="/arrow-left.svg" alt="" />
          </button>
          <div className="navbarNav">
            <ul className="navList">
              <li>
                <button className="buttonNav" onClick={() => navigate("/catalogue")}>
                  <span className="box">Catalogue</span>
                </button>
              </li>
              <li>
                <button className="buttonNav" onClick={() => navigate("/")}>
                  <span className="box">Artists</span>
                </button>
              </li>
                {isAuthenticated ? (
                <li>
                    <button className="buttonNav profile" onClick={() => navigate(`/users/${user.username}`)}>
                    <span className="box">My Profile</span>
                    </button>
                </li>
                ) : null}
              <li>
                <button
                  className="buttonNav"
                  onClick={handleAccountOrLogout}
                  title={isAuthenticated ? user?.name : undefined}
                >
                  <span className="box">
                    {isAuthenticated ? "Logout" : "Login"}
                  </span>
                </button>
              </li>
              <li>
                <button className="buttonNav" onClick={() => navigate("/docs-page")}>
                  <span className="box">DOCS</span>
                </button>
              </li>
            </ul>
          </div>
          <button className="buttonArrow" onClick={scrollRight}>
            <img src="/arrow-right.svg" alt="" />
          </button>
        </nav>

        <nav className="navbar">
          <button className="buttonMerc type1" onClick={handleCart}>
            <span className="btn-txt">Cart</span>
          </button>
        </nav>
      </section>
    </header>
  );
}