import { Pool } from "pg";

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export const database = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
});

export const connectDatabase = async () => {
  try {
    const client = await database.connect();
    console.log("Database connected successfully");
    client.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
