import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Interface for flight details
interface Flight {
  flightNumber: string;
  airline: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
}

// Fetch available flights from RapidAPI Flight Scraper
export const searchFlights = async (origin: string, destination: string, departureDate: string): Promise<Flight[]> => {
  try {
    const response = await fetch(`https://flights-scraper-api.p.rapidapi.com/flights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'flights-scraper-api.p.rapidapi.com',
      },
      body: JSON.stringify({
        origin,
        destination,
        departureDate,
        passengers: 1,
        currency: 'USD',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch flights: ${response.statusText}`);
    }

    const data: { flights: any[] } = await response.json() as { flights: any[] };

    return data.flights.slice(0, 5).map((flight: any) => ({
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
