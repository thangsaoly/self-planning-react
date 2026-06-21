import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Trip = sequelize.define("Trip", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  travelStatus: {
    type: DataTypes.ENUM("visiting", "upcoming", "visited"),
    defaultValue: "visiting",
    allowNull: false,
  },
  travelType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emoji: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleMapsLink: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  todoNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  highlightNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  packingNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  costNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // JSON structural fields
  booking: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  transport: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  itinerary: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  todos: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  highlights: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  packing: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  costs: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: "trips",
});

export default Trip;
