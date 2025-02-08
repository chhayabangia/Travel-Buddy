import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Itinerary extends Model {}

Itinerary.init(
  {
    id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    departureDateDate: { type: DataTypes.DATE, allowNull: false },
    returnDate: { type: DataTypes.DATE, allowNull: false },
    flight: { type: DataTypes.STRING, allowNull: false },
    hotel: { type: DataTypes.STRING, allowNull: false },
    activities: { type: DataTypes.JSON },
  },
  {
    sequelize,
    tableName: "itineraries",
  }
);

export default Itinerary;