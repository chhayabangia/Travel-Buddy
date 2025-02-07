import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Itinerary extends Model {}

Itinerary.init(
  {
    id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    activities: { type: DataTypes.JSON },
  },
  {
    sequelize,
    tableName: "itineraries",
  }
);

export default Itinerary;