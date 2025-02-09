import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Weather extends Model {}

Weather.init(
  {
    city: { type: DataTypes.STRING, allowNull: false },
    temperature: { type: DataTypes.FLOAT, allowNull: false },
    condition: { type: DataTypes.STRING, allowNull: false },
    humidity: { type: DataTypes.INTEGER, allowNull: false },
    windSpeed: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    sequelize,
    modelName: "Weather",
  }
);

export default Weather;
