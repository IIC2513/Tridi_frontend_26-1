import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../context/AuthContext';
import PWANavbar from './PWANavbar';
import PWAHome from './PWAHome';
import PWALoginPage from './PWALoginPage';
import './PWAApp.css';

export default function PWAApp() {
  const [search, setSearch] = useState("");

  return (
    <Router basename="/pwa">
      <AuthProvider>
        <div className="pwa-app">
          <PWANavbar searchValue={search} onSearchChange={setSearch} />
          <Routes>
            <Route path="/" element={<PWAHome search={search} />} />
            <Route path="/login" element={<PWALoginPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
