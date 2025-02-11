// Reworking some code here too just like db.ts, old code is below
import sequelize from "../config/db.js"; 
import { UserFactory } from "./user.js"; 
import { Itinerary } from "./itinerary.js"; 
import { Weather } from "./Weather.js"; 

const User = UserFactory(sequelize);

// Define relationships between models
User.hasMany(Itinerary, { foreignKey: "userId", onDelete: "CASCADE" });
Itinerary.belongsTo(User, { foreignKey: "userId" });

Itinerary.hasOne(Weather, { foreignKey: "itineraryId", onDelete: "CASCADE" });
Weather.belongsTo(Itinerary, { foreignKey: "itineraryId" });

// Sync models with the database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); 
    console.log("✅ Database synchronized successfully.");
  } catch (error) {
    console.error("❌ Database synchronization failed:", error);
  }
};

// Execute database sync on startup
syncDatabase();

export { sequelize, User, Itinerary, Weather };

/* import sequelize from "../config/db.js"; 
import { UserFactory } from "./user.js"; 
import { Itinerary } from "./itinerary.js"; 
import { Weather } from "./Weather.js"; 
const User = UserFactory(sequelize);
//Define relationships between models
User.hasMany(Itinerary, { foreignKey: "userId", onDelete: "CASCADE" });
Itinerary.belongsTo(User, { foreignKey: "userId" });

Itinerary.hasOne(Weather, { foreignKey: "city", onDelete: "CASCADE" });
Weather.belongsTo(Itinerary, { foreignKey: "itineraryId" });

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

export { sequelize, User, Itinerary, Weather }; */
