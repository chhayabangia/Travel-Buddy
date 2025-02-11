import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import itineraryRoutes from './routes/itinerary.js';
// import flightRoutes from './routes/flights.js';
import authRoutes from './routes/auth.js';
import flightRoutes from "./routes/flights-amadeus.js";
import hotelRoutes from './routes/hotels-amadeus.js';
import cityRoutes from "./routes/cities.js";
//import { sequelize } from './models/index.js';
dotenv.config();

const app = express();

// Middleware
// ✅ Allow frontend to access backend from Render (CORS Fix)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', 
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});*/

// ✅ Ensure Render assigns a port dynamically
const PORT = process.env.PORT || 5000;

// Routes
app.use('/api', itineraryRoutes);
// app.use('/api', flightRoutes);
app.use('/api', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/flights", flightRoutes);

// ✅ Start Server & Sync Database
const startServer = async () => {
  try {
    await sequelize.authenticate(); // Ensure DB is connected
    console.log('✅ Database connected successfully.');

    await sequelize.sync(); 
    console.log('✅ Database models synchronized.');

    // 🟡 Log the assigned PORT before the server starts
    console.log(`🟡 Render assigned PORT: ${process.env.PORT}`);
    console.log(`🟡 Using PORT: ${PORT}`);

    if (!process.env.PORT) {
      console.warn("⚠️ Warning: No PORT assigned by Render, using fallback 5000!");
    }

    app.get("/", (req, res) => {
      res.send("✅ Travel Buddy API is running!");
    });

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};


/* const startServer = async () => {
  try {
    if (process.env.DB_CONNECT !== "false") { 
      await sequelize.authenticate(); // Ensure DB is connected
      console.log("Database connected successfully.");
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};*/


startServer();
