import { DataTypes, Optional, Model } from "sequelize";
import sequelize from "../config/db.js";

interface WeatherAttributes {
  itineraryId: number;
  city: string;
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
}

interface WeatherCreationAttributes extends Optional<WeatherAttributes, "itineraryId"> {}

class Weather extends Model<WeatherAttributes, WeatherCreationAttributes> implements WeatherAttributes {
  public itineraryId!: number;
  public id!: number;
  public city!: string;
  public temperature!: number;
  public condition!: string;
  public humidity?: number;
  public windSpeed?: number;
}

Weather.init(
  {
    itineraryId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    city: { type: DataTypes.STRING, allowNull: false },
    temperature: { type: DataTypes.FLOAT, allowNull: false },
    condition: { type: DataTypes.STRING, allowNull: false },
    humidity: { type: DataTypes.FLOAT, allowNull: true },
    windSpeed: { type: DataTypes.FLOAT, allowNull: true },
  },
  { sequelize, tableName: "weather" }
);

export default Weather;