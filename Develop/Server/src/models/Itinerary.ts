// Itinerary model (saved itinerary)

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Itinerary = sequelize.define('Itinerary', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  destination: { type: DataTypes.STRING, allowNull: false },
  departureDate: { type: DataTypes.DATE, allowNull: false },
  returnDate: { type: DataTypes.DATE, allowNull: true },
  flight: { type: DataTypes.STRING, allowNull: false },
  hotel: { type: DataTypes.STRING, allowNull: false },
  attractions: { type: DataTypes.JSON, allowNull: true },
});

export default Itinerary;