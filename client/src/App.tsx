// Main app entry point
// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react"; 
import Navbar from "./components/Navbar";
import FlightSearch from "./components/FlightSearch";
import HotelSearch from "./components/HotelSearch";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./css/global.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Create a toggle function
  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

  return (
    <Router>
      <div className={`app-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
        {/* Pass `toggleDarkMode` instead of `setIsDarkMode` */}
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/flights"
            element={<div className="search-container"><FlightSearch isDarkMode={isDarkMode} /></div>}
          />
          <Route
            path="/hotels"
            element={<div className="search-container"><HotelSearch isDarkMode={isDarkMode} /></div>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
