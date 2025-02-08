// Manages user itineraries

import { Itinerary } from '../models/Itinerary.js';
import { getWeatherByCity } from '../services/weatherService.js';
import { searchFlights } from '../services/flightService.js';

export const saveItinerary = async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, hotel, attractions, flightNumber, airline, price } = req.body;
    
    if (!flightNumber || !airline || !price) {
      return res.status(400).json({ error: 'Flight selection is required' });
    }
    
    const newItinerary = await Itinerary.create({
      userId: req.user.id,
      origin,
      destination,
      departureDate,
      returnDate,
      flight: flightNumber,
      airline,
      price,
      hotel,
      attractions,
    });
    
    res.status(201).json(newItinerary);
  } catch (error) {
    console.error('Error saving itinerary:', error);
    res.status(500).json({ error: 'Failed to save itinerary' });
  }
};

// EXAMPLE ITINERARY:

/* {
  "origin": "LAX",
  "destination": "JFK",
  "departureDate": "2025-04-01",
  "returnDate": "2025-04-07",
  "hotel": "Marriott NYC",
  "attractions": ["Statue of Liberty", "Times Square"],
  "flightNumber": "AA123",
  "airline": "American Airlines",
  "price": 350
} */
