import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import itineraryRoutes from './routes/itinerary.js';
import flightRoutes from './routes/flights.js';
import authRoutes from './routes/auth.js';
import hotelRoutes from './routes/hotels.js';
//import { sequelize } from './models/index.js';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow frontend to access backend
    credentials: true,
  })
);
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

// Routes
app.use('/api', itineraryRoutes);
app.use('/api', flightRoutes);
app.use('/api', authRoutes);
app.use('/api/hotels', hotelRoutes);

// Start Server & Sync Database
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.sync(); 

    console.log(' Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
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
