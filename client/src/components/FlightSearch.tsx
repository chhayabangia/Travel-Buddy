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

const FlightSearch: React.FC = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    console.log("🔎 User Input:", destination);
    const normalizedDestination = destination.trim().toLowerCase();
    const mappedDestination = airportMappings[Object.keys(airportMappings).find(key => key.toLowerCase() === normalizedDestination) || ""];

    if (!mappedDestination) {
      console.error("❌ No mapped airport code found!");
      setError("Invalid city name. Please select a valid destination.");
      setLoading(false);
      return;
    }

    console.log("✅ Final Mapped Airport Code:", mappedDestination);
    const apiUrl = `https://travel-buddy-api-24xq.onrender.com/api/flights/search?departure=${departure}&destination=${mappedDestination}&date=${date}`;
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

      <ul>
        {flights.map((flight, index) => (
          <li key={index} onClick={() => setSelectedFlight(flight)}>
            <strong>{flight.airline} {flight.flightNumber}</strong>
            <p>Price: ${flight.price}</p>
            <p>Departure: {new Date(flight.departureTime).toLocaleString()}</p>
            <p>Arrival: {new Date(flight.arrivalTime).toLocaleString()}</p>
          </li>
        ))}
      </ul>

      {selectedFlight && (
        <div className="selected-flight">
          <h3>Selected Flight</h3>
          <p>{selectedFlight.airline} {selectedFlight.flightNumber}</p>
          <p>Price: ${selectedFlight.price}</p>
          <p>Departure: {new Date(selectedFlight.departureTime).toLocaleString()}</p>
          <p>Arrival: {new Date(selectedFlight.arrivalTime).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
