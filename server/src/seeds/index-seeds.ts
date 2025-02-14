import { seedUsers } from "./user-seeds";
import { sequelize } from "../models/index-models";

const seedAll = async (): Promise<void> => {
  try {
    await sequelize.sync({ force: true });
    console.log("\n----- Database Synced -----\n");

    await seedUsers();
    console.log("\n----- Users Seeded -----\n");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedAll();