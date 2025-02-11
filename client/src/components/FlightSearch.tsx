import React, { useState, useEffect } from "react";
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

const FlightSearch: React.FC = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("price");
  const [airportSuggestions, setAirportSuggestions] = useState<string[]>([]);

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

  // Sorting flights based on user selection
  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "departure") return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
    if (sortBy === "airline") return a.airline.localeCompare(b.airline);
    return 0;
  });

  // Autocomplete airport suggestions
  useEffect(() => {
    const suggestions = Object.keys(airportMappings).filter((airport) =>
      airport.toLowerCase().includes(departure.toLowerCase())
    );
    setAirportSuggestions(suggestions);
  }, [departure]);

  return (
    <div className="flight-search-container">
      <h2>Search Flights</h2>
      <label>
        Departure City:
        <input
          type="text"
          placeholder="Enter departure city"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />
        {airportSuggestions.length > 0 && (
          <ul className="suggestions">
            {airportSuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => setDeparture(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </label>
      <label>
        Destination:
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </label>
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p className="error-message">{error}</p>}

      <label htmlFor="sortFlights">Sort by:</label>
      <select id="sortFlights" onChange={(e) => setSortBy(e.target.value)}>
        <option value="price">Price (Lowest First)</option>
        <option value="airline">Airline (A-Z)</option>
        <option value="departure">Departure Time (Earliest First)</option>
        <option value="arrivalTime">Arrival Time</option>
      </select>

      <ul>
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
