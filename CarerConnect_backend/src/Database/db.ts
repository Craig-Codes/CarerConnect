// Code produces and instance of the database and allows connections to it

import { Pool } from "pg";
// database connection details are stored in a .env file
// this adds security, as these should be hidden in production code, and not placed into source control
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// A connection pool manages connections to the database
// This allows for shared connections and load balancing
export const database = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
});

// function connects the database, ensuring it is ready for connections
export const connectDatabase = async () => {
  try {
    const client = await database.connect();
    console.log("Database connected successfully");
    client.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
