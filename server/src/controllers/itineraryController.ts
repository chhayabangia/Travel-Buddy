import { Request, Response } from "express";
import Itinerary from "../models/itinerary.js";
import { getWeatherByCity } from "../services/weatherServices.js";

// Extend Express Request to include user information
interface AuthRequest extends Request {
  user?: { id: number };
}

// Define Itinerary request body type
interface ItineraryRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  hotel?: string;
  attractions?: string[];
  flightNumber: string;
  airline: string;
  price: number;
}

// Create an itinerary
export const createItinerary = async (req: AuthRequest, res: Response) => {
  try {
    const { destination } = req.body as ItineraryRequest;
    const weather = await getWeatherByCity(destination);
    const newItinerary = await Itinerary.create({ ...req.body, weather });
    res.status(201).json({ message: "Itinerary created successfully", itinerary: newItinerary });
  } catch (error) {
    res.status(500).json({ error: "Failed to create itinerary" });
  }
};

// Get all itineraries
export const getAllItineraries = async (_req: Request, res: Response) => {
  try {
    const itineraries = await Itinerary.findAll();
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve itineraries" });
  }
};

// Get itinerary by ID
export const getItineraryById = async (req: Request, res: Response) => {
  try {
    const itinerary: Itinerary | null = await Itinerary.findByPk(req.params.id);
    if (itinerary === null || itinerary === undefined) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    return res.status(200).json(itinerary);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve itinerary" });
  }
};

// Update itinerary
export const updateItinerary = async (req: Request, res: Response) => {
  try {
    const itinerary = await Itinerary.findByPk(req.params.id);
    if (!itinerary) return res.status(404).json({ error: "Itinerary not found" });
    await itinerary.update(req.body);
    return res.status(200).json({ message: "Itinerary updated successfully", itinerary });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update itinerary" });
  }
};

// Delete itinerary
export const deleteItinerary = async (req: Request, res: Response) => {
  try {
    const itinerary = await Itinerary.findByPk(req.params.id);
    if (!itinerary) return res.status(404).json({ error: "Itinerary not found" });
    await itinerary.destroy();
    return res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete itinerary" });
  }
};