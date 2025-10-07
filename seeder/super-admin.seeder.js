const { hash } = require("bcrypt");
const ROLES = require("../models/enum");
const UserModel = require("../models/user.schema");

async function superAdminSeeder(adminUsername, adminPassword) {
  const adminFound = await UserModel.findOne({username: adminUsername, role: "admin" });
  if (!adminFound) {
    try {
      const hashedPassword = await hash(adminPassword, 10)
      const newUser = await UserModel.create({
        username: adminUsername,
        password: hashedPassword,
        role: ROLES.ADMIN,
        fullName: "Admin",
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = superAdminSeeder;
