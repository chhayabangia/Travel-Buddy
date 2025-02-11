// AmadeusAPI version of flight search
import { useState } from "react";
import "../css/FlightSearch.css";

interface Flight {
  flightNumber: string;
  airline: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
}

const FlightSearch = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      /* const response = await fetch(
        `http://localhost:5000/api/flights/search?origin=${origin}&destination=${destination}&date=${departureDate}`
      );*/
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/flights/search?origin=${origin}&destination=${destination}&date=${departureDate}`
      );
      
      const data = await response.json();

      console.log("🛫 API Flight Data:", data);

      if (response.ok) {
        setFlights(data);
      } else {
        setError(data.error || "No flights found");
      }
    } catch (err) {
      setError("Error fetching flights");
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSelection = (flight: Flight) => {
    console.log("✈️ Selected Flight:", flight);
    setSelectedFlight(flight);
  };

  return (
    <div className="flight-search">
      <h2>✈️ Find Your Flight</h2>

      <label>
        Origin:
        <input type="text" placeholder="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
      </label>

      <label>
        Destination:
        <input type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
      </label>

      <label>
        Departure Date:
        <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
      </label>

      <button onClick={fetchFlights} disabled={loading}>{loading ? "Searching..." : "🔍 Search Flights"}</button>

      {error && <p className="error-message">{error}</p>}

      <ul className="flight-list">
        {flights?.length > 0 ? (
          flights.map((flight, index) => (
            <li key={index} className="flight-item">
              <h3>{flight.airline} - Flight {flight.flightNumber}</h3>
              <p>Departure: {flight.departureTime} | Arrival: {flight.arrivalTime}</p>
              <p className="flight-price">💰 ${flight.price}</p>
              <button className="select-flight-btn" onClick={() => handleFlightSelection(flight)}>
                Select Flight
              </button>
            </li>
          ))
        ) : (
          !loading && (
            <li>
              <p className="no-results">No flights found. Try another search.</p>
            </li>
          )
        )}
      </ul>

      {selectedFlight && (
        <div className="selected-flight">
          <h4>✅ Selected Flight:</h4>
          <p><strong>Airline:</strong> {selectedFlight.airline}</p>
          <p><strong>Flight Number:</strong> {selectedFlight.flightNumber}</p>
          <p><strong>Price:</strong> ${selectedFlight.price}</p>
          <p><strong>Departure:</strong> {selectedFlight.departureTime}</p>
          <p><strong>Arrival:</strong> {selectedFlight.arrivalTime}</p>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
