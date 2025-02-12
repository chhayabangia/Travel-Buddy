// RapidAPI verison of flight search
import React, { useState } from 'react';
import "../css/FlightSearch.css";

interface Flight {
  flightNumber: string;
  airline: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
}

interface FlightSelectionProps {
  origin: string;
  destination: string;
  departureDate: string;
  onSelectFlight: (flight: Flight) => void;
}

const FlightSelection: React.FC<FlightSelectionProps> = ({ origin, destination, departureDate, onSelectFlight }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/flights?origin=${origin}&destination=${destination}&departureDate=${departureDate}`
      );

      const data = await response.json();
      if (response.ok) {
        setFlights(data);
      } else {
        setError(data.error || 'No flights found');
      }
    } catch (err) {
      setError('Error fetching flights');
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSelection = (flight: Flight) => {
    setSelectedFlight(flight);
    onSelectFlight(flight);
  };

  return (
    <div className="flight-search">
      <h2>✈️ Select Your Flight</h2>
      <button className="search-btn" onClick={fetchFlights} disabled={loading}>
        {loading ? "Loading..." : "🔍 Search Flights"}
      </button>
      {error && <p className="error-message">{error}</p>}

      {/* ✅ Fallback message if no flights are found */}
      {!loading && flights.length === 0 && !error && (
        <p className="no-results">No flights found. Try another search.</p>
      )}

      {/* ✅ Display available flights */}
      <ul className="flight-list">
        {flights.map((flight, index) => (
          <li key={index} className={`flight-item ${selectedFlight === flight ? "selected" : ""}`}>
            <h3>{flight.airline} - Flight {flight.flightNumber}</h3>
            <p>Departure: {flight.departureTime} | Arrival: {flight.arrivalTime}</p>
            <p className="flight-price">💰 ${flight.price}</p>
            <button className="select-flight-btn" onClick={() => handleFlightSelection(flight)}>
              Select
            </button>
          </li>
        ))}
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

export default FlightSelection;
