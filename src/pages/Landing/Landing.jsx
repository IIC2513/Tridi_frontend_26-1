import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Landing.css";

export default function Landing() {

  window.scrollTo(0, 0);

  const navigate = useNavigate();

  function EnterButton() {
    return (
        <button className="animated-button">
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
            <path
            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            ></path>
        </svg>
        <span className="text">Enter the catalogue</span>
        <span className="circle"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
            <path
            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            ></path>
        </svg>
        </button>
    );
  }


  return (
    <div>
        <Navbar>
        </Navbar>
        <Footer>
        </Footer>
        <div className="landing-page">
            <section className="section-landing">
                <div className="section-sentences">
                    <h1 className="opening-sentence">
                        Find
                    </h1>
                    <h1 className="opening-middle-sentence">
                        sculpts
                    </h1>
                    <h1 className="opening-sentence">
                        for you.
                    </h1>
                    <p className="second-sentence">
                    Browse our catalogue of high quality sculpts, and
                    find one that piques your interest
                    </p>
                    <EnterButton>
                    </EnterButton>
                </div>
            </section>
            <img src="model.svg"></img>
        </div>
    </div>
  );
}
