// updated from skyscanner to rapidapi
import express from 'express';
import { searchFlights } from '../services/flightService.js';

const router = express.Router();

router.get('/flights', async (req, res) => {
  const { origin, destination, departureDate } = req.query;

  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const flights = await searchFlights(origin, destination, departureDate);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

export default router;
