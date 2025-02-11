// Changing the db.ts to see if it fixes the db issue i was having with render, old code is below
import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined in environment variables.");
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Disable logging for cleaner output
});

// Function to check and log the connection
async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Render PostgreSQL database successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

// Call the function to test connection
checkConnection();

export default sequelize;

/* import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

const isUsingRemoteDB = Boolean(process.env.DB_URL);

const sequelize = isUsingRemoteDB
  ? new Sequelize(process.env.DB_URL as string)
  : new Sequelize(
      process.env.DB_NAME || '',
      process.env.DB_USER || '',
      process.env.DB_PASSWORD,
      {
        host: 'localhost',
        dialect: 'postgres',
        dialectOptions: {
          decimalNumbers: true,
        },
      }
    );

// Function to check and log the connection
async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    if (isUsingRemoteDB) {
      console.log(`Connected to remote database: ${process.env.DB_URL}`);
    } else {
      console.log(
        `Connected to local database: ${sequelize.config.database} at host ${sequelize.config.host}`
      );
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Call the function to log connection details
checkConnection();

export default sequelize; */


/*// Used to connect to a local database
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
    console.error("Error checking/creating database:", error);
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

export default sequelize;*/
