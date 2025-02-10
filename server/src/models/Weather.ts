import { Sequelize, DataTypes, Optional, Model } from "sequelize";

interface WeatherAttributes {
  itineraryId: number;
  city: string;
  temperature: number;
  description: string;
}

interface WeatherCreationAttributes extends Optional<WeatherAttributes, "itineraryId"> {}

export class Weather extends Model<WeatherAttributes, WeatherCreationAttributes> implements WeatherAttributes {
  public itineraryId!: number;
  public id!: number;
  public city!: string;
  public temperature!: number;
  public description!: string;
}
export function WeatherFactory(sequelize: Sequelize): typeof Weather {
Weather.init(
  {
    itineraryId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    city: { type: DataTypes.STRING, allowNull: false },
    temperature: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
  },
  { 
    tableName: "weather",
    sequelize,
   }
);

return Weather;
}