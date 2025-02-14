// Reworking some code here too just like db.ts, old code is below 
import sequelize from "../config/db.js"; 
import { UserFactory } from "./user-models.js"; 
import { Itinerary } from "./itinerary-models.js"; 
import { Weather } from "./Weather.js"; 

// ✅ Initialize models
const User = UserFactory(sequelize);
const models = { User, Itinerary, Weather };

// ✅ Ensure models are properly registered before syncing
Object.entries(models).forEach(([modelName, model]) => {
  sequelize.models[modelName] = model;
});

export { sequelize, User, Itinerary, Weather };

// ✅ Define relationships AFTER model registration
User.hasMany(Itinerary, { foreignKey: "userId", onDelete: "CASCADE" });
Itinerary.belongsTo(User, { foreignKey: "userId" });

Itinerary.hasOne(Weather, { foreignKey: "itineraryId", onDelete: "CASCADE" });
Weather.belongsTo(Itinerary, { foreignKey: "itineraryId" });

console.log("✅ Registered Sequelize Models:", Object.keys(sequelize.models));


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
