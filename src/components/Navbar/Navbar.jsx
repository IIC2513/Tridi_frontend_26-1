import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";


export default function Navbar() {

  const navigate = useNavigate();

  return (
    <header>
        <section className="containerNavbar">
            <nav className="navbar">
                <Link to="/" className="navbarLogo">
                    <img src="/Tridi..svg"></img>
                </Link>
            </nav>
            <nav className="navbarList">
                <div className="navbarNav">
                    <ul className="navList">
                        <li>
                            <button className="buttonNav">
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