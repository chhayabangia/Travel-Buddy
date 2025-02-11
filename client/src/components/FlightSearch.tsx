import React, { useState } from "react";
import "../css/FlightSearch.css";

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

interface FlightSearchProps {
  isDarkMode: boolean;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ isDarkMode }) => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("price");

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    console.log("🔎 User Input:", destination);
    const mappedDestination = airportMappings[destination] || destination;

    if (!mappedDestination) {
      console.error("❌ No mapped airport code found!");
      setError("Invalid city name. Please select a valid destination.");
      setLoading(false);
      return;
    }

    console.log("✅ Final Mapped Airport Code:", mappedDestination);
    const apiUrl = `https://travel-buddy-api-24xq.onrender.com/api/flights/search?departure=${departure}&destination=${mappedDestination}&date=${date}&sortBy=${sortBy}`;
    console.log("🚀 Sending Flight API Request:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const data: Flight[] = await response.json();
      console.log("✅ Flight API Response:", data.length, "results");
      setFlights(data);
    } catch (err) {
      console.error("❌ Error fetching flights:", err);
      setError("Failed to fetch flight data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "airline":
        return a.airline.localeCompare(b.airline);
      case "departure":
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      case "arrival":
        return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className={`flight-search-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <h2>Search Flights</h2>
      <div className="search-form">
        <label htmlFor="departure">Departure</label>
        <input
          id="departure"
          type="text"
          placeholder="Enter departure city"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />

        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="search-btn" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <label htmlFor="sortFlights">Sort by:</label>
      <select id="sortFlights" onChange={(e) => setSortBy(e.target.value)}>
        <option value="price">Price (Lowest First)</option>
        <option value="airline">Airline (A-Z)</option>
        <option value="departure">Departure Time (Earliest First)</option>
        <option value="arrival">Arrival Time (Earliest First)</option>
      </select>

      <ul className="flight-results">
        {sortedFlights.map((flight, index) => (
          <li key={index}>
            <strong>{flight.airline} {flight.flightNumber}</strong>
            {index === 0 && <span className="cheapest">🔥 Cheapest</span>}
            <p>Price: ${flight.price}</p>
            <p>Departure: {new Date(flight.departureTime).toLocaleString()}</p>
            <p>Arrival: {new Date(flight.arrivalTime).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightSearch;
