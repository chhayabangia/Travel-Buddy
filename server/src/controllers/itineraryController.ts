import { Request, Response } from "express";
import { Itinerary } from "../models/itinerary.js";
import { getWeatherByCity, getCoordinates } from "../services/weatherServices.js";
import { searchFlights } from "../services/flightService.js";

interface AuthRequest extends Request {
  user?: { id: number }; 
}

export const createItinerary = async (req: AuthRequest, res: Response) => {
  try {
   
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user ID provided" });
    }

    const { origin, destination, departureDate, returnDate } = req.body;
    if (!origin || !destination || !departureDate) {
      return res.status(400).json({ error: "Missing required fields: origin, destination, or departureDate" });
    }

    const destinationWeatherData = await getWeatherByCity(destination);
    if (destinationWeatherData.error) {
      throw new Error(destinationWeatherData.error);
    }
    const { coordinates: destinationCoords, currentWeather, forecast } = destinationWeatherData;

    const originCoords = await getCoordinates(origin);

    if (!originCoords || !destinationCoords) {
      return res.status(400).json({ error: "Failed to fetch coordinates for origin or destination" });
    }
    const flights = await searchFlights(originCoords, destinationCoords, departureDate, returnDate);

    const newItinerary = await Itinerary.create({
      userId: req.user?.id,
      origin,
      destination,
      departureDate,
      returnDate,
      flight: flights.length > 0 ? flights[0].flightNumber : "N/A",
      airline: flights.length > 0 ? flights[0].airline : "N/A",
      price: flights.length > 0 ? flights[0].price : 0,
      weather: currentWeather ? { temperature: currentWeather.temperature, description: currentWeather.description } : null,
  });

    return res.status(201).json({
      message: "Itinerary created successfully",
      itinerary: newItinerary,
      flights,
      forecast,
    });
  } catch (error: any) {
    console.error("Error creating itinerary:", error);
    return res.status(500).json({
      error: "Failed to create itinerary",
      details: error.message,
    });
  }
};

export const getAllItineraries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user ID provided" });
    }

    const itineraries = await Itinerary.findAll({ where: { userId: req.user.id } });
    return res.status(200).json(itineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    return res.status(500).json({ error: "Failed to retrieve itineraries" });
  }
};

export const getItineraryById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user ID provided" });
    }

    const { id } = req.params;
    const itinerary = await Itinerary.findOne({ where: { id, userId: req.user.id } });

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    return res.status(200).json(itinerary);
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return res.status(500).json({ error: "Failed to retrieve itinerary" });
  }
};

export const updateItinerary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user ID provided" });
    }

    const { id } = req.params;
    const itinerary = await Itinerary.findOne({ where: { id, userId: req.user.id } });

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    await itinerary.update(req.body);
    return res.status(200).json({ message: "Itinerary updated successfully", itinerary });
  } catch (error) {
    console.error("Error updating itinerary:", error);
    return res.status(500).json({ error: "Failed to update itinerary" });
  }
};

export const deleteItinerary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user ID provided" });
    }

    const { id } = req.params;
    const itinerary = await Itinerary.findOne({ where: { id, userId: req.user.id } });

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    await itinerary.destroy();
    return res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    return res.status(500).json({ error: "Failed to delete itinerary" });
  }
};
