// Navigation component for the application
import { Link } from "react-router-dom";
import "./../css/global.css"; // Adjust path if necessary

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🌍 Travel Buddy</h2>
      <div className="nav-links">
        <Link to="/">🏠 Home</Link>
        <Link to="/flights">✈️ Flights</Link>
        <Link to="/hotels">🏨 Hotels</Link>
        <Link to="/login">🔑 Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
