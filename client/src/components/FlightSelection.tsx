import React, { useState } from 'react';

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
    <div className="container mt-4">
      <h2>Select Your Flight</h2>
      <button className="btn btn-primary mb-3" onClick={fetchFlights} disabled={loading}>
        {loading ? 'Loading...' : 'Search Flights'}
      </button>
      {error && <p className="text-danger">{error}</p>}
      {flights.length > 0 && (
        <div>
          <h3>Available Flights</h3>
          <ul className="list-group">
            {flights.map((flight, index) => (
              <li key={index} className={`list-group-item d-flex justify-content-between align-items-center ${selectedFlight === flight ? 'active' : ''}`}>
                <span>
                  <strong>{flight.airline}</strong> - Flight {flight.flightNumber} - ${flight.price}
                  <br />
                  <small>Departure: {flight.departureTime} | Arrival: {flight.arrivalTime}</small>
                </span>
                <button className="btn btn-success" onClick={() => handleFlightSelection(flight)}>
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedFlight && (
        <div className="mt-3">
          <h4>Selected Flight:</h4>
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
