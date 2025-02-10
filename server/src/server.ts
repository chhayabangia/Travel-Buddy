import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import itineraryRoutes from './routes/itinerary.js';
import flightRoutes from './routes/flights.js';
import authRoutes from './routes/auth.js';
//import { sequelize } from './models/index.ts';
dotenv.config();

const PORT = process.env.PORT || 5000;

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
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((err) => console.error("Database connection error:", err));

// Routes
const baseRouter = express.Router();
baseRouter.use('/itinerary', itineraryRoutes);
baseRouter.use('/flights', flightRoutes);
baseRouter.use('/auth', authRoutes);
app.use('/api', baseRouter);
// Start Server & Sync Database
const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync(); 
      console.log('Database models synchronized.');
    } else {
      console.log('Production environment detected. Use migrations for database synchronization.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
}
};


startServer();
