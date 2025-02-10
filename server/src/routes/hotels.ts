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

    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: (cityCode as string).trim(),
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotel data' });
  }
});

export default router;
