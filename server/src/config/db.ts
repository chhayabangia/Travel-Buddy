import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pkg from "pg"; 

const { Client } = pkg;

dotenv.config();


const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;


const createDatabaseIfNotExists = async () => {
  const client = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: Number(DB_PORT) || 5432,
    database: "postgres", 
  });

  try {
    await client.connect();

   
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'`);
    
    if (res.rowCount === 0) {
     
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Database ${DB_NAME} created successfully.`);
    } else {
      console.log(`Database ${DB_NAME} already exists.`);
    }
  } catch (error) {
    console.error("❌ Error checking/creating database:", error);
  } finally {
    await client.end();
  }
};


await createDatabaseIfNotExists();


if (!DB_HOST) {
  throw new Error("DB_HOST is not defined");
}

const sequelize = new Sequelize(
  DB_NAME as string,
  DB_USER as string,
  DB_PASSWORD as string,
  {
    host: DB_HOST,
    dialect: "postgres",
    port: Number(DB_PORT) || 5432,
    logging: false,
  }
);

export default sequelize;
