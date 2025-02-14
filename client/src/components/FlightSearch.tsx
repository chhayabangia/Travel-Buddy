import { useState } from "react";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaUsers } from "react-icons/fa";
import "../css/flights.css";
import "../css/forms.css";

const airportMappings: Record<string, string> = {
  "New York": "NYC",
  "Orlando": "MCO",
  "Los Angeles": "LAX",
  "Chicago": "ORD",
};

interface Flight {
  airline: string;
  flightNumber: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
}

const FlightSearch: React.FC = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("price");
  const [travelers, setTravelers] = useState("1 traveler");

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
  
    console.log("🔎 User Input:", destination);
    const mappedDeparture = airportMappings[departure] || departure;
    const mappedDestination = airportMappings[destination] || destination;
    
    if (!mappedDeparture || !mappedDestination) {
      console.error("❌ No mapped airport code found!");
      setError("Invalid city name. Please select a valid departure and destination.");
      setLoading(false);
      return;
    }
  
    console.log("✅ Final Mapped Airport Code:", mappedDestination);
    const BASE_URL =
      import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000";
    
    const formattedSortBy = sortBy.split(":")[0];  // ✅ Ensures no unexpected ":1" format
    const apiUrl = `${BASE_URL}/api/flights/search?origin=${mappedDeparture}&destination=${mappedDestination}&date=${date}&sortBy=${formattedSortBy}`;
  
    console.log("🚀 API Request:", { origin: mappedDeparture, destination: mappedDestination, date, sortBy });
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const data: Flight[] = await response.json();
      console.log("✅ Flight API Response:", data.length, "results");
  
      // ✅ Append new results instead of replacing them
      setFlights((prevFlights) => [...prevFlights, ...data]);
  
    } catch (err) {
      console.error("❌ Error fetching flights:", err);
      setError("Failed to fetch flight data. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "departure") return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
    if (sortBy === "arrival") return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime(); 
    if (sortBy === "airline") return a.airline.localeCompare(b.airline);
    return 0;
  });  

  return (
    <div className="flight-search-container">
      <h2>✈️ Search Flights</h2>

      {/* 🔹 Flight Search Bar */}
      <div className="flight-search-bar">
        
        {/* 🌍 Departure Input */}
        <div className="input-group">
          <label htmlFor="departure" className="visually-hidden">Departure</label>
          <FaPlaneDeparture className="input-icon" />
          <input
            id="departure"
            type="text"
            placeholder="From where?"
            title="Enter departure city"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
        </div>

        {/* 🏙 Destination Input */}
        <div className="input-group">
          <label htmlFor="destination" className="visually-hidden">Destination</label>
          <FaPlaneArrival className="input-icon" />
          <input
            id="destination"
            type="text"
            placeholder="To where?"
            title="Enter destination city"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* 📅 Date Picker */}
        <div className="input-group">
          <label htmlFor="date" className="visually-hidden">Travel Date</label>
          <FaCalendarAlt className="input-icon" />
          <input
            id="date"
            type="date"
            title="Select travel date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* 👤 Travelers */}
        <div className="input-group">
          <label htmlFor="travelers" className="visually-hidden">Travelers</label>
          <FaUsers className="input-icon" />
          <select
            id="travelers"
            title="Select number of travelers"
            value={travelers}  // ✅ Use travelers state
            onChange={(e) => setTravelers(e.target.value)}>
              <option value="1 traveler">1 traveler</option>
              <option value="2 travelers">2 travelers</option>
              <option value="3 travelers">3 travelers</option>
              <option value="4+ travelers">4+ travelers</option>
          </select>
        </div>
        {/* 📌 Additional Options */}
        <div className="flight-options">
          <label>
            <input type="checkbox" /> Add a hotel
          </label>
          <label>
            <input type="checkbox" /> Add a car
          </label>
        </div>
      </div>

      {/* 🔘 Search Button */}
      <button className="search-button" onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>



      {/* 🔹 Sorting Dropdown */}
      <label htmlFor="sortFlights">Sort by:</label>
      <select
        id="sortFlights"
        title="Sort flights by"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}>
          <option value="price">Price (Lowest First)</option>
          <option value="airline">Airline (A-Z)</option>
          <option value="departure">Departure Time (Earliest First)</option>
          <option value="arrival">Arrival Time (Earliest First)</option>
      </select>

      {/* ❌ Show Error Message if Needed */}
      {error && <p className="error-message">{error}</p>}

      {/* 📌 Flight Search Results */}
      {sortedFlights.length > 0 && (
        <ul className="flight-list">
          {sortedFlights.map((flight, index) => (
            <li key={index} className="flight-item">
              <strong>{flight.airline} {flight.flightNumber}</strong>
              <p>Price: ${flight.price}</p>
              <p>Departure: {new Date(flight.departureTime).toLocaleString()}</p>
              <p>Arrival: {new Date(flight.arrivalTime).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FlightSearch;
