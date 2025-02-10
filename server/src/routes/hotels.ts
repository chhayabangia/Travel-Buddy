import * as express from 'express';
import { Request, Response, Router } from 'express';

import amadeus from '../services/amadeus.js';

const router: Router = express.Router();

router.get('/search', async ({ query }: Request, res: Response): Promise<void> => {
  try {
    const { cityCode } = query;

    if (!cityCode) {
      res.status(400).json({ error: 'Missing required cityCode' });
      return;
    }

    // Map city names to IATA city codes for Amadeus API
    const cityToIATACode: { [key: string]: string } = {
      "NEW YORK": "NYC",
      "LOS ANGELES": "LAX",
      "CHICAGO": "CHI",
      "MIAMI": "MIA",
      "HOUSTON": "HOU",
      "SAN FRANCISCO": "SFO",
      "LAS VEGAS": "LAS",
      "ORLANDO": "ORL",
      "BOSTON": "BOS",
      "SEATTLE": "SEA"
    };

    const cityCodeStr = Array.isArray(cityCode) ? cityCode[0] : cityCode; // Ensure it's a string
    const formattedCityCode = cityToIATACode[(cityCodeStr as string).trim().toUpperCase()] || (cityCodeStr as string).trim().toUpperCase();
    console.log("🔄 Converted city name to IATA Code:", formattedCityCode);   

    console.log("🔎 Received cityCode:", cityCode);
    console.log("🔄 Formatted cityCode:", formattedCityCode);
    
    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: formattedCityCode,
    });
    

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotel data' });
  }
});

export default router;
