//Routs for itinerary CRUD operations

import express from 'express';
import { saveItinerary, getItineraries } from '../controllers/itineraryController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/itinerary', saveItinerary);
router.get('/itineraries', getItineraries);

export default router;