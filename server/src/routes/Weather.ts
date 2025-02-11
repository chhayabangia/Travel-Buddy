import express from "express";
import { Weather } from "../models/Weather.js";

const router = express.Router();

// Save weather data
router.post("/", async (req, res) => {
  try {
    const weather = await Weather.create(req.body);
    res.status(201).json(weather);
  } catch (error) {
    res.status(500).json({ error: "Failed to save weather data" });
  }
});

export default router;
