import React from "react";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Landing.css";

export default function Landing() {
  
  const navigate = useNavigate();

  return (
    <div>
        <Navbar>
        </Navbar>
    </div>
  );
}
