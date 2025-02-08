//Fetch flight data from Skyscanner API

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export const searchFlights = async (origin, destination, departureDate) => {
    try {
      const response = await fetch(
        `https://partners.api.skyscanner.net/apiservices/v3/flights/live/search?apikey=${process.env.SKYSCANNER_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: {
              market: 'US',
              locale: 'en-US',
              currency: 'USD',
              queryLegs: [
                {
                  originPlaceId: { iata: origin },
                  destinationPlaceId: { iata: destination },
                  date: { year: new Date(departureDate).getFullYear(), month: new Date(departureDate).getMonth() + 1, day: new Date(departureDate).getDate() },
                },
              ],
              adults: 1,
            },
          }),
        }
      );
  
      const data = await response.json();
      return data.flights.slice(0, 5).map(flight => ({
        flightNumber: flight.itineraries[0].segments[0].flightNumber,
        airline: flight.itineraries[0].segments[0].operatingCarrier,
        price: flight.price.total,
      }));
    } catch (error) {
      console.error('Error fetching flights:', error);
      return [];
    }
  };
  
