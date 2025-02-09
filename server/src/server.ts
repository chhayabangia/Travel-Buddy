import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import itineraryRoutes from './routes/itinerary.js';
import flightRoutes from './routes/flights.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow frontend to access backend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.use('/api', itineraryRoutes);
app.use('/api', flightRoutes);
app.use('/api', authRoutes);

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

startServer();
