import { DataTypes, Optional, Model } from "sequelize";
import sequelize from "../config/db.js";


interface ItineraryAttributes {
  id: number;
  userId: number;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  flight: string;
  airline: string;
  price?: number;
  hotel?: string;
  attractions?: string[];
}

interface ItineraryCreationAttributes extends Optional<ItineraryAttributes, "id"> {}

class Itinerary extends Model<ItineraryAttributes, ItineraryCreationAttributes> implements ItineraryAttributes {
  public id!: number;
  public userId!: number;
  public origin!: string;
  public destination!: string;
  public departureDate!: string;
  public returnDate!: string;
  public flight!: string;
  public airline!: string;
  public price?: number;
  public hotel?: string;
  public attractions?: string[];
}

Itinerary.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    origin: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    departureDate: { type: DataTypes.STRING, allowNull: false },
    returnDate: { type: DataTypes.STRING, allowNull: true },
    flight: { type: DataTypes.STRING, allowNull: false },
    airline: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    hotel: { type: DataTypes.STRING, allowNull: true },
    attractions: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  },
  { sequelize, modelName: "itineraries" }
);

export default Itinerary;