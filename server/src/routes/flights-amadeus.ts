import * as express from 'express';
import { Request, Response, Router } from 'express';
import { searchFlights } from "../services/flightService-amadeus.js";

const router: Router = express.Router();

router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { origin, destination, date } = req.query;

    if (![origin, destination, date].every(Boolean)) {
      res.status(400).json({ error: 'Missing required parameters' });
      return; 
    }

    const flights = await searchFlights(origin as string, destination as string, date as string);
    
    res.json(flights);
  } catch (error) {
    console.error('❌ Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
});

export default router;
