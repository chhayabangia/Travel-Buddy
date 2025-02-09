import sequelize from "../config/db.js"; 
import User from "./user.js"; 
import Itinerary from "./itinerary.js"; 
//import Weather from "./Weather.js"; 

//Define relationships between models
User.hasMany(Itinerary, { foreignKey: "userId", onDelete: "CASCADE" });
Itinerary.belongsTo(User, { foreignKey: "userId" });

/*Itinerary.hasOne(Weather, { foreignKey: "city", onDelete: "CASCADE" });
Weather.belongsTo(Itinerary, { foreignKey: "itineraryId" });
export { sequelize, User, Itinerary, Weather };*/

//Sync models with the database (optional, can also be done in `db.ts`)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); 
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Database synchronization failed:", error);
  }
};

//Execute database sync (optional)
syncDatabase();

export { sequelize, User, Itinerary };
