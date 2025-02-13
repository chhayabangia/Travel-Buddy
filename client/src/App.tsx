// Main app entry point
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FlightSearch from "./components/FlightSearch";
import HotelSearch from "./components/HotelSearch";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterForm from "./pages/Register";
import "./css/global.css";
import "./css/components.css";
import "./css/flights.css";
import "./css/hotels.css";
import "./css/forms.css";
import "./css/navbar.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* 🔹 Navbar Section */}
        <Navbar />

        <main>
          {/* 🔹 Route Setup for Pages */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/flights"
              element={
                <div className="search-container">
                  <FlightSearch />
                </div>
              }
            />
            <Route
              path="/hotels"
              element={
                <div className="search-container">
                  <HotelSearch />
                </div>
              }
            />
          </Routes>
        </main> 
      </div>
    </Router>
  );
}

export default App;
