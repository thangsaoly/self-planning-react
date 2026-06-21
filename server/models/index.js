import sequelize from "../config/database.js";
import User from "./User.js";
import Trip from "./Trip.js";

// Define Associations
User.hasMany(Trip, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

Trip.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

export { sequelize, User, Trip };
export default { sequelize, User, Trip };
