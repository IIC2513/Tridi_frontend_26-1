import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../context/AuthContext';
import PWANavbar from './PWANavbar';
import './PWAApp.css';

function PWAHome() {
  return (
    <main className="pwa-main">
      <h1 className="pwa-title">Tridi</h1>
      <p className="pwa-subtitle">Your models always with you!</p>
    </main>
  );
}

export default function PWAApp() {
  return (
    <Router basename="/pwa">
      <AuthProvider>
        <div className="pwa-app">
          <PWANavbar />
          <Routes>
            <Route path="/" element={<PWAHome />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
