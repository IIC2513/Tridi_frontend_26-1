import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { useStatus } from "../../context/StatusContext";
import "./Navbar.css";
import CartView from "../CartView/CartView";

export default function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const { showStatus } = useStatus();
    const [OpenCart, setCartOpen] = useState(false);

    useEffect(() => {
        const onExpired = () => {
            if (!isAuthenticated) return;
            logout();
            setCartOpen(false);
            showStatus({
                variant: "warning",
                message: "Your session expired. Please log in again.",
            });
            navigate("/login");
        };
        window.addEventListener("auth:expired", onExpired);
        return () => window.removeEventListener("auth:expired", onExpired);
    }, [isAuthenticated, logout, showStatus, navigate]);

    const scrollLeft = () => {
        const scroll = document.querySelector(".navbarNav");
        scroll.scrollLeft -= 200;
    };
    const scrollRight = () => {
        const scroll = document.querySelector(".navbarNav");
        scroll.scrollLeft += 200;
    };

    const handleCart = () => {
        if (isAuthenticated) {
            setCartOpen(!OpenCart);
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
                                <button className="buttonNav" onClick={() => navigate("/artists")}>
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
                            {isAuthenticated && user?.role === "admin" ? (
                                <li>
                                    <button className="buttonNav" onClick={() => navigate("/admin")}>
                                        <span className="box">Admin Panel</span>
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
            {OpenCart ? <CartView handleCloseCart={handleCart}></CartView> : null}
        </header>
    );
}