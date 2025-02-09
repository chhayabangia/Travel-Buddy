import { type Request, type Response } from 'express';
import express from 'express';
import { searchFlights } from '../services/flightService.js';
const router = express.Router();

router.get('/flights', async (req: Request, res: Response): Promise<void> => {
  const { origin, destination, departureDate } = req.query as { origin: string; destination: string; departureDate: string };

  if (!origin || !destination || !departureDate) {
    res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const flights = await searchFlights(origin, destination, departureDate);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

export default router;
