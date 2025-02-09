import { Request, Response } from 'express';
import { searchFlights } from '../services/flightService.js';

interface FlightQueryParams {
  origin: string;
  destination: string;
  departureDate: string;
}

export const getFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { origin, destination, departureDate } = req.query as unknown as FlightQueryParams;

    if (!origin || !destination || !departureDate) {
      res.status(400).json({ error: 'Missing required parameters: origin, destination, or departureDate' });
      return;
    }

    const flights = await searchFlights(origin, destination, departureDate);

    if (!flights || flights.length === 0) {
      res.status(404).json({ error: 'No flights found for the selected date' });
      return;
    }

    res.status(200).json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to retrieve flights' });
  }
};