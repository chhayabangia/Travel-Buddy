// Navigation component for the application
import React from "react";
import { Link } from "react-router-dom";
import "./../css/global.css";

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void; 
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <nav className={`navbar ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/flights">Flights</Link>
        <Link to="/hotels">Hotels</Link>
      </div>

      {/* Dark mode toggle button */}
      <button className="toggle-button" onClick={toggleDarkMode}>
        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </nav>
  );
};


export default Navbar;
