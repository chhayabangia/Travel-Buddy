import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;