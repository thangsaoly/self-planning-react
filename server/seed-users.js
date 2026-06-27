import bcrypt from "bcryptjs";
import { sequelize } from "./models/index.js";
import User from "./models/User.js";

const seedUsers = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const usersToCreate = [
      { fullname: "Customer A", email: "customerA@test.com", password: hashedPassword },
      { fullname: "Customer B", email: "customerB@test.com", password: hashedPassword },
      { fullname: "Admin A", email: "adminA@test.com", password: hashedPassword },
      { fullname: "Admin B", email: "adminB@test.com", password: hashedPassword }
    ];

    for (const u of usersToCreate) {
      const exists = await User.findOne({ where: { email: u.email } });
      if (!exists) {
        await User.create(u);
        console.log(`Created user: ${u.fullname} (${u.email})`);
      } else {
        console.log(`User already exists: ${u.fullname} (${u.email})`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedUsers();
