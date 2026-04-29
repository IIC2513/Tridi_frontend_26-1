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
        <div className="cards-container">
            <CardAboutUs name={"Francisco Cornejo"}
                        description={"Tangamandapio"}
                        github={"https://github.com/VerditoRaccoon"}
                        telegram={"https://t.me/VerditoRaccoon"}
                        image={"/src/assets/blanckuser.svg"}>
            </CardAboutUs>   
            <CardAboutUs name={"Francisco Cornejo"}
                        description={"Tangamandapio"}
                        github={"https://github.com/VerditoRaccoon"}
                        telegram={"https://t.me/VerditoRaccoon"}
                        image={"/src/assets/blanckuser.svg"}>
            </CardAboutUs>   
            <CardAboutUs name={"Francisco Cornejo"}
                        description={"Tangamandapio"}
                        github={"https://github.com/VerditoRaccoon"}
                        telegram={"https://t.me/VerditoRaccoon"}
                        image={"/src/assets/blanckuser.svg"}>
            </CardAboutUs>   
        </div>     
        <Footer>
        </Footer>
    </div>
  );
}
