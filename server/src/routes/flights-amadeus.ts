import * as express from 'express';
import { Request, Response, Router } from 'express';
import { searchFlights, getNearestAirport } from "../services/flightService-amadeus.js";

const router: Router = express.Router();

router.get('/search', async (req: Request, res: Response, next: express.NextFunction) => {
  try {
    console.log("🟡 Received flight search request:", req.query);

    // Ensure query parameters are valid strings
    const originStr: string = typeof req.query.origin === 'string' ? req.query.origin : "";
    const destinationStr: string = typeof req.query.destination === 'string' ? req.query.destination : "";
    const date: string = typeof req.query.date === 'string' ? req.query.date : "";

    if (!originStr || !destinationStr || !date) {
      console.error("❌ Error: Missing required parameters.", { origin: req.query.origin, destination: req.query.destination, date: req.query.date });
      res.status(400).json({ error: "Missing required parameters for flight search." });
      return;
    }

    // Convert city names to IATA codes if needed
    const airportCodeOrigin: string = originStr.length === 3 ? originStr : (await getNearestAirport(originStr)) || "";
    const airportCodeDestination: string = destinationStr.length === 3 ? destinationStr : (await getNearestAirport(destinationStr)) || "";

    if (!airportCodeOrigin || !airportCodeDestination) {
      console.error("❌ Error: Unable to determine airport codes.", { origin: airportCodeOrigin, destination: airportCodeDestination });
      res.status(400).json({ error: "Invalid origin or destination. Please try again." });
      return;
    }

    console.log(`🟡 Final Airport Codes Sent to Amadeus API:
        Origin Airport: ${airportCodeOrigin}
        Destination Airport: ${airportCodeDestination}
        Date: ${date}`);

    // Fetch flight data
    const flights = await searchFlights(airportCodeOrigin, airportCodeDestination, date);

    console.log("🟡 Full Amadeus API Response:", JSON.stringify(flights, null, 2));

    if (!flights || flights.length === 0) {
      console.warn("⚠️ No flights found for this search.");
      res.status(404).json({ error: "No flights available for the selected route and date." });
      return;
    }

    // ✅ Send the response
    res.json(flights);
    return;

  } catch (error) {
    console.error('❌ Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to fetch flight data' });
    return;
  }
});

export default router;
