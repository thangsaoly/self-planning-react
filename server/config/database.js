import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_NAME || "self_planning_db";
const dbUser = process.env.DB_USER || "root";
const dbPass = process.env.DB_PASS !== undefined ? process.env.DB_PASS : "";
const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbPort = process.env.DB_PORT || 3306;

console.log(`Connecting to database '${dbName}' on ${dbHost}:${dbPort} as user '${dbUser}'...`);

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    timestamps: true,
  },
});

export default sequelize;
