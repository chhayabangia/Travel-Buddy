import { Sequelize, DataTypes, Optional, Model } from "sequelize";
import { User } from "./user-models";

interface weatherData {
  temperature: number;
  description: string;
}


interface ItineraryAttributes {
  id: string;
  userId: number;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date;
  flight?: string | number;
  airline?: string;
  price?: number;
  hotel?: string;
  weather?: weatherData | null;
  attractions?: string[];
}

interface ItineraryCreationAttributes extends Optional<ItineraryAttributes, "id"> {}

export class Itinerary extends Model<ItineraryAttributes, ItineraryCreationAttributes> implements ItineraryAttributes {
  public id!: string;
  public userId!: number;
  public origin!: string;
  public destination!: string;
  public departureDate!: Date;
  public returnDate!: Date;
  public flight?: string | number;
  public airline?: string;
  public price?: number;
  public hotel?: string;
  public weather?: weatherData | null;
  public attractions?: string[];

  public readonly user!: User;
}

export function ItineraryFactory(sequelize: Sequelize): typeof Itinerary {
Itinerary.init(
  {
    id: { type: DataTypes.UUID, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    origin: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    departureDate: { type: DataTypes.DATE, allowNull: false },
    returnDate: { type: DataTypes.DATE, allowNull: true },
    flight: { type: DataTypes.STRING, allowNull: true },
    airline: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: true },
    hotel: { type: DataTypes.STRING, allowNull: true },
    attractions: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    weather: { type: DataTypes.JSON, allowNull: true },
  },
  { sequelize, 
    tableName: "itineraries",
   }
);

return Itinerary;
}