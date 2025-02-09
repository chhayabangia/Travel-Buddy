// Handles flight API requests
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

export const searchFlights = async (req: Request, res: Response) => {
  const { origin, destination, departureDate } = req.query;

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
                date: { year: 2025, month: 4, day: 1 }, // departureDate?
              },
            ],
            adults: 1,
          },
        }),
      }
    );

    const flightData = await response.json();
    res.json(flightData);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to retrieve flight options' });
  }
};