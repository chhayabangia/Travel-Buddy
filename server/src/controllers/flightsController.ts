import { Request, Response } from 'express';
import { searchFlights } from '../services/flightService.js';
import { getCoordinates } from '../services/weatherServices.js';

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
    /*if (!/^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
      res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      return;
    }*/

    const originCoords = await getCoordinates(origin);
    const destinationCoords = await getCoordinates(destination);

    const flights = await searchFlights(originCoords, destinationCoords, departureDate);

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