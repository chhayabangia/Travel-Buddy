import express, { Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { createItinerary, getAllItineraries, updateItinerary, deleteItinerary } from '../controllers/itineraryController.js';

const router = express.Router();

// Routes for managing itineraries
router.post('/itinerary', authenticateJWT, async (req: Request, res: Response) => {
  await createItinerary(req, res);
});

router.get('/itineraries', authenticateJWT, async (req: Request, res: Response) => {
  await getAllItineraries(req, res);
});

router.put('/itineraries/:id', authenticateJWT, async (req: Request, res: Response) => {
  await updateItinerary(req, res);
});

router.delete('/itineraries/:id', authenticateJWT, async (req: Request, res: Response) => {
  await deleteItinerary(req, res);
});

export default router;
