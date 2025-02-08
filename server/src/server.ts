import express from 'express';
import sequelize from './config/database.js';
import flightsRouter from './routes/flights.js';
import itineraryRouter from './routes/itinerary.js';
import authRouter from './routes/auth.js';

const app = express();
app.use(express.json());

app.use('/api', flightsRouter);
app.use('/api', itineraryRouter);
app.use('/api', authRouter);

sequelize.sync()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Database connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));