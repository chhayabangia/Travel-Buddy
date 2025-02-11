import * as express from 'express';
import { Request, Response, Router } from 'express';
import { searchFlights } from "../services/flightService-amadeus.js";

const router: Router = express.Router();

router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🟡 Received flight search request:", req.query);

    const { origin, destination, date } = req.query;

    if (![origin, destination, date].every(Boolean)) {
      console.error("❌ Missing parameters:", { origin, destination, date });
      res.status(400).json({ error: 'Missing required parameters' });
      return; 
    }

    const flights = await searchFlights(origin as string, destination as string, date as string);
    console.log("🟡 API Response from Amadeus:", flights);
    
    if (!flights || flights.length === 0) {
      console.warn("⚠️ No flights found for this search.");
      res.status(404).json({ error: "No flights available for the selected route and date." });
      return; 
    }

    // ✅ Send the response without returning anything
    res.json(flights);

  } catch (error) {
    console.error('❌ Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to fetch flight data' });
    return; 
  }
});

export default router;
