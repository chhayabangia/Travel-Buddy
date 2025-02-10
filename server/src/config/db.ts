import dotenv from 'dotenv';
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
          /*ssl: {
            require: true,
            rejectUnauthorized: false,
          },*/
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

export default sequelize;