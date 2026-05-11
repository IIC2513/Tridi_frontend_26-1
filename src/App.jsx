import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import AboutUs from "./pages/AboutUs/AboutUs";
import Catalogue from "./pages/Catalogue/Catalogue";
import DocsPage from "./pages/DocsPage/DocsPage";
import './App.css'

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/docs-page" element={<DocsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
