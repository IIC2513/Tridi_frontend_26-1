import React from "react";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CardAboutUs from "../../components/CardAboutUs/CardAboutUs";
import "./AboutUs.css";

export default function AboutUs() {
  
  const navigate = useNavigate();

  return (
    <div>
        <Navbar>
        </Navbar>
        <Footer>
        </Footer>
        <section className="section-aboutus">
            <div className="section-information">
                <h1 className="title-aboutus">
                    About Us.
                </h1>
                <img src="rectangle.svg"></img>
                <p className="description-team">
                    At Tridi, we empower creativity by providing a dynamic e‑commerce platform where designers, 
                    artists, and enthusiasts can seamlessly buy and sell 3D models. Our mission is to build a trusted
                    marketplace that fosters innovation, collaboration, and accessibility, turning digital imagination
                    into real opportunities for a global community.
                </p>
            </div>
            <div className="cards-container">
                <div className="card-separator">
                    <CardAboutUs name={"Francisco Cornejo"}
                                description={"Computer science student interested in videogames and web development."}
                                github={"https://github.com/VerditoRaccoon"}
                                telegram={"https://t.me/VerditoRaccoon"}
                                image={"FranciscoIcon.jpeg"}>
                    </CardAboutUs>
                </div>
                <div className="card-separator">
                    <CardAboutUs name={"Gonzalo Rivas"}
                                description={"I like computer-generated graphics, from Tron to TouchDesign, from 3D to Tridi."}
                                github={"https://github.com/MigoWithTigo"}
                                image={"GonzaloIcon.jpeg"}>
                    </CardAboutUs>
                </div>
                <div className="card-separator">
                    <CardAboutUs name={"Ignacio Gutierrez"}
                                description={"I am a third-year Computer Science Engineering student at the Pontificia Universidad Católica de Chile"}
                                image={"IgnacioIcon.jpeg"}
                                github={"https://github.com/Igufu"}>
                    </CardAboutUs>
                </div> 
            </div>   
        </section>  
    </div>
  );
}
