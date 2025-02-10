import { useState } from "react";

import "../css/FlightSearch.css";


const FlightSearch = () => {
  const [flights, setFlights] = useState<any[]>([]);
  const [origin, setOrigin] = useState("JFK");
  const [destination, setDestination] = useState("LAX");
  const [date, setDate] = useState("2025-03-15");
  const [loading, setLoading] = useState(false);

  const searchFlights = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/flights/search?origin=${origin}&destination=${destination}&date=${date}`
      );
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Flight Search</h2>
      <label>Origin: </label>
      <input 
        type="text" 
        value={origin} 
        onChange={(e) => setOrigin(e.target.value)} 
        placeholder="Enter origin (e.g., JFK)" 
        aria-label="Origin Airport Code"
      />

      <label> Destination: </label>
      <input 
        type="text" 
        value={destination} 
        onChange={(e) => setDestination(e.target.value)} 
        placeholder="Enter destination (e.g., LAX)" 
        aria-label="Destination Airport Code"
      />

      <label> Date: </label>
      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        aria-label="Departure Date"
      />

      <button type="button" onClick={searchFlights} disabled={loading}>
        {loading ? "Searching..." : "Search Flights"}
      </button>


      <ul>
        {flights.map((flight, index) => (
          <li key={index}>
            {flight.itineraries[0].segments[0].departure.iataCode} →
            {flight.itineraries[0].segments[0].arrival.iataCode} | Price: $
            {flight.price.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightSearch;
