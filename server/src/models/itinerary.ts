import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { User } from "./user.js";

interface ItineraryAttributes {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date;
  flight: string;
  airline: string;
  price: number;
  hotel: string;
  attractions: object;
}

interface ItineraryCreationAttributes extends Optional<ItineraryAttributes, "id"> {}

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