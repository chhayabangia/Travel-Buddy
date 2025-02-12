import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import itineraryRoutes from './routes/itinerary.js';
import authRoutes from './routes/auth.js';
import flightRoutes from "./routes/flights-amadeus.js";
import hotelRoutes from './routes/hotels-amadeus.js';
import cityRoutes from "./routes/cities.js";

dotenv.config();

const app = express();

// ✅ Allow frontend to access backend from Render (CORS Fix)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', 
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Define API Routes
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/flights", flightRoutes);

// ✅ Root Route for Debugging
app.get("/", (req, res) => {
  res.send("✅ Travel Buddy API is running!");
});

// ✅ Ensure Render assigns a port dynamically
const PORT = process.env.PORT;

if (!PORT) {
  console.error("❌ Render did NOT provide a PORT! Exiting...");
  process.exit(1);
}

console.log(`🟡 Render assigned PORT: ${PORT}`);
console.log(`🟡 Forcing server to use PORT: ${PORT}`);

// ✅ Start Server & Sync Database
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    await sequelize.sync(); 
    console.log('✅ Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`✅ Server running on assigned port: ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

startServer();


/*
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});*/

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


