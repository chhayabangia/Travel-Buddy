// Main app entry point
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import Navbar
import FlightSearch from "./components/FlightSearch";
import HotelSearch from "./components/HotelSearch";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./css/App.css";
import "./css/global.css";

function App() {
    const [activeTab, setActiveTab] = useState("flights"); // Default tab: Flights
  
    return (
      <Router>
        <div className="app-container">
          {/* 🔹 Navbar Section */}
          <Navbar />
  
          {/* 🔹 Route Setup for Pages */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
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
        </div>
      </Router>
    );
  }
  
  export default App;