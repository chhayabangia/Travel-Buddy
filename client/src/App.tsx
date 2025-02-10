// Main app entry point
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FlightSearch from "./components/FlightSearch.tsx";
import HotelSearch from "./components/HotelSearch.tsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./css/global.css";

function App() {
  
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