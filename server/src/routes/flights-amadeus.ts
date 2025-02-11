import * as express from 'express';
import { Request, Response, Router } from 'express';
import { searchFlights, getNearestAirport } from "../services/flightService-amadeus.js";

const router: Router = express.Router();

router.get('/search', async (req: Request, res: Response, next: express.NextFunction) => {
  try {
    console.log("🟡 Received flight search request:", req.query);

    const originStr: string = typeof req.query.origin === 'string' ? req.query.origin : "";
    const destinationStr: string = typeof req.query.destination === 'string' ? req.query.destination : "";
    const date: string = typeof req.query.date === 'string' ? req.query.date : "";
    const sortBy: string = typeof req.query.sortBy === 'string' ? req.query.sortBy : "price"; // Default to price

    if (!originStr || !destinationStr || !date) {
      console.error("❌ Error: Missing required parameters.");
      res.status(400).json({ error: "Missing required parameters for flight search." });
      return;
    }

    const airportCodeOrigin: string = originStr.length === 3 ? originStr : (await getNearestAirport(originStr)) || "";
    const airportCodeDestination: string = destinationStr.length === 3 ? destinationStr : (await getNearestAirport(destinationStr)) || "";

    if (!airportCodeOrigin || !airportCodeDestination) {
      console.error("❌ Error: Unable to determine airport codes.");
      res.status(400).json({ error: "Invalid origin or destination. Please try again." });
      return;
    }

    console.log(`🟡 Final Airport Codes Sent to Amadeus API:
        Origin Airport: ${airportCodeOrigin}
        Destination Airport: ${airportCodeDestination}
        Date: ${date}`);

    // Fetch flight data
    let flights = await searchFlights(airportCodeOrigin, airportCodeDestination, date);

    if (!flights || flights.length === 0) {
      console.warn("⚠️ No flights found for this search.");
      res.status(404).json({ error: "No flights available for the selected route and date." });
      return;
    }

    // Apply sorting
    flights = flights.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "departure") return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      if (sortBy === "airline") return a.airline.localeCompare(b.airline);
      return 0;
    });

    console.log("🟡 Sorted Flight Results:", flights);

    res.json(flights);
  } catch (error) {
    console.error('❌ Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
});

export default router;
