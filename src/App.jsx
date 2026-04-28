import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import AboutUs from "./pages/AboutUs/AboutUs";
import './App.css'

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
