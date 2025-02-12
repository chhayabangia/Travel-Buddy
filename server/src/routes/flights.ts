import { type Request, type Response } from 'express';
import express from 'express';
import { searchFlights } from '../services/flightService.js';
import { getCoordinates } from '../services/weatherServices.js';
const router = express.Router();

router.get('/flights', async (req: Request, res: Response): Promise<void> => {
  const { origin, destination, departureDate } = req.query as { origin: string; destination: string; departureDate: string };

  if (!origin || !destination || !departureDate) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  try {
    console.log("🛫 Fetching coordinates for Origin:", origin);
    console.log("🛬 Fetching coordinates for Destination:", destination);

    const originCoords = await getCoordinates(origin);
    const destinationCoords = await getCoordinates(destination);
    
    console.log("✈️ Origin Coordinates:", originCoords);
    console.log("🛬 Destination Coordinates:", destinationCoords);

    const flights = await searchFlights(originCoords, destinationCoords, departureDate);
    if (!flights || flights.length === 0) {
      res.status(404).json({ error: 'No flights found for the selected date' });
      return;
    }
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

export default router;
