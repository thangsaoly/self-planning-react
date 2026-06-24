import bcrypt from "bcryptjs";
import User from "./models/User.js";
import { sequelize } from "./models/index.js";

async function seed() {
  try {
    // Connect and Sync
    await sequelize.authenticate();
    console.log("Connected to MySQL for seeding...");
    
    // sync with alter: true to add the 'role' column if it's not there
    await sequelize.sync({ alter: true });

    // Clear existing test accounts to avoid duplicates
    await User.destroy({ where: { email: ["admin@test.com", "customer@test.com"] } });

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const customerPassword = await bcrypt.hash("customer123", salt);

    // Create Admin
    await User.create({
      fullname: "System Admin",
      email: "admin@test.com",
      password: adminPassword,
      role: "admin"
    });

    // Create Customer
    await User.create({
      fullname: "John Customer",
      email: "customer@test.com",
      password: customerPassword,
      role: "customer"
    });

    console.log("Test accounts created successfully!");
    console.log("Admin: admin@test.com / admin123");
    console.log("Customer: customer@test.com / customer123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding accounts:", error);
    process.exit(1);
  }
}

seed();
