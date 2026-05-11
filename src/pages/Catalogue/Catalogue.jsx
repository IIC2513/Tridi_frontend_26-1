import React from "react";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import SearchBar from "../../components/Searchbar/Searchbar";
import "./Catalogue.css";

export default function Catalogue() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  return (
  <SearchBar value={query} onChange={setQuery}
  placeholder="Search models..."/>
  );

}