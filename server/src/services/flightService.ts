// updated from skyscanner to rapidapi
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export const searchFlights = async (origin, destination, departureDate) => {
  try {
    const response = await fetch(`https://flights-scraper-api.p.rapidapi.com/flights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'flights-scraper-api.p.rapidapi.com',
      },
      body: JSON.stringify({
        origin: origin,
        destination: destination,
        departureDate: departureDate,
        returnDate: null, // Add if needed
        passengers: 1,
        currency: 'USD',
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch flights');

    // Limit to 5 options and map response format
    return data.flights.slice(0, 5).map(flight => ({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      price: flight.price.total,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
    }));
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
};
