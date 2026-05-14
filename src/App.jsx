import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import AboutUs from "./pages/AboutUs/AboutUs";
import Catalogue from "./pages/Catalogue/Catalogue";
import DocsPage from "./pages/DocsPage/DocsPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import './App.css'

function App() {

  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/docs-page" element={<DocsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
