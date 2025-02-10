import express, { Request, Response } from "express";
import amadeus from "../services/amadeus.js";

const router = express.Router();

router.get("/search", (req: Request, res: Response) => {
  (async () => {
    try {
      const city = req.query.city as string;

      if (!city) {
        return res.status(400).json({ error: "City name is required" });
      }

      console.log("🔎 Searching for city:", city);

      const response = await amadeus.referenceData.locations.get({
        keyword: city,
        subType: "CITY",
      });

      console.log("✅ City search response:", response.data);
      return res.json(response.data);
    } catch (error) {
      console.error("❌ Error fetching city data:", error);
      return res.status(500).json({ error: "Failed to fetch city data" });
    }
  })();
});

export default router;
