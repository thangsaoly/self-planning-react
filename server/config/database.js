import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbStorage = process.env.DB_STORAGE || "./database.sqlite";

console.log(`Connecting to SQLite database at '${dbStorage}'...`);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbStorage,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    timestamps: true,
  },
});

export default sequelize;
