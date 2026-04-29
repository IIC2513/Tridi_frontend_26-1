import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Footer.css";


export default function Footer() {

  const navigate = useNavigate();
  
  const handleAboutUs = () => {
    navigate('/about-us');
  };

  return (
        <div className="section-info">
            <button className="button-info">
                Contact
            </button>
            <p></p>
            <button className="button-info">
                GitHub
            </button>
            <button className="button-info" onClick={handleAboutUs}>
                About Us
            </button>
        </div>
  );
}