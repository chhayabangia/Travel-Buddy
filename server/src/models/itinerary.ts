import { DataTypes, Optional, Model } from "sequelize";
import sequelize from "../config/db.js";

interface weatherData {
  temperature: number;
  description: string;
}


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
  weather?: weatherData | null;
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
  public weather?: weatherData | null;
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
    price: { type: DataTypes.FLOAT, allowNull: true },
    hotel: { type: DataTypes.STRING, allowNull: true },
    attractions: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    weather: { type: DataTypes.JSON, allowNull: true },
  },
  { sequelize, modelName: "itineraries" }
);

export class Itinerary extends Model<ItineraryAttributes, ItineraryCreationAttributes> implements ItineraryAttributes {
  public id!: string;
  public userId!: string;
  public origin!: string;
  public destination!: string;
  public departureDate!: Date;
  public returnDate!: Date;
  public flight!: string;
  public airline!: string;
  public price!: number;
  public hotel!: string;
  public attractions!: object;

  public readonly user!: User;
}

export function ItineraryFactory(sequelize: Sequelize): typeof Itinerary {
  Itinerary.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false },
      origin: { type: DataTypes.STRING, allowNull: false },
      destination: { type: DataTypes.STRING, allowNull: false },
      departureDate: { type: DataTypes.DATE, allowNull: false },
      returnDate: { type: DataTypes.DATE, allowNull: false },
      flight: { type: DataTypes.STRING },
      airline: { type: DataTypes.STRING },
      price: { type: DataTypes.FLOAT },
      hotel: { type: DataTypes.STRING },
      attractions: { type: DataTypes.JSON },
    },
    {
      sequelize,
      tableName: "itineraries",
    }
  );

  return Itinerary;
}