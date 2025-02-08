//Routs for flight API/data

import express from 'express';
import { searchFlights } from '../controllers/flightsController.js';

const router = express.Router();

router.get('/flights', async (req, res) => {
    const { origin, destination, departureDate } = req.query;
  
    if (!origin || !destination || !departureDate) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }
  
    try {
      const flights = await searchFlights(origin, destination, departureDate);
      if (flights.length === 0) {
        return res.status(404).json({ error: 'No flights found for the selected date' });
      }
      res.json(flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ error: 'Failed to fetch flights' });
    }
  });
  
  export default router;