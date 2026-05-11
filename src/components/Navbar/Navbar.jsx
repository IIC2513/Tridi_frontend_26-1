import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";


export default function Navbar() {

  const navigate = useNavigate();

  const scrollLeft  = () => {
    const scroll = document.querySelector(".navbarNav");
    scroll.scrollLeft -= 200;
  };

  const scrollRight  = () => {
    const scroll = document.querySelector(".navbarNav");
    scroll.scrollLeft += 200;
  };

  const handleCatalogue = () => {
    navigate('/catalogue');
  };


  return (
    <header>
        <section className="containerNavbar">
            <nav className="navbar">
                <Link to="/" className="navbarLogo">
                    <img src="/Tridi..svg"></img>
                </Link>
            </nav>
            <nav className="navbarList">
                <button className="buttonArrow" onClick={scrollLeft}><img src="arrow-left.svg"/></button>
                <div className="navbarNav">
                    <ul className="navList">
                        <li>
                            <button className="buttonNav" onClick={handleCatalogue}>
                                <span className="box">
                                    Catalogue
                                </span>
                            </button>
                        </li>
                        <li>
                            <button className="buttonNav">
                                <span className="box">
                                    Artists
                                </span>
                            </button>
                        </li>
                        <li>
                            <button className="buttonNav">
                                <span className="box">
                                    For You
                                </span>
                            </button>
                        </li>
                        <li>
                            <button className="buttonNav">
                                <span className="box">
                                    Account
                                </span>
                            </button>
                        </li>
                        <li>
                            <button className="buttonNav">
                                <span className="box">
                                    Top
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
                <button className="buttonArrow" onClick={scrollRight}><img src="arrow-right.svg"/></button>
            </nav>
            <nav className="navbar">
                <button className="buttonMerc type1">
                    <span className="btn-txt">Cart</span>
                </button>
            </nav>
        </section>
    </header>
  );
}