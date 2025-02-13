// Navigation component for the application
import React from "react";
import { Link } from "react-router-dom"; 
import "../css/navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🌍 Travel Buddy</div>
      <ul className="nav-links">
        <li>
          <Link to="/"><span>🏠</span> Home</Link>
        </li>
        <li>
          <Link to="/flights"><span>✈️</span> Flights</Link>
        </li>
        <li>
          <Link to="/hotels"><span>🏨</span> Hotels</Link>
        </li>
        <li>
          <Link to="/login"><span>🔑</span> Login</Link>
        </li>
        <li>
          <Link to="/register"><span>📝</span> Register</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
