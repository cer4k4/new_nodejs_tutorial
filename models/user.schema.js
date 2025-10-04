const { Schema, model } = require("mongoose");
const ROLES = require("../models/enum");

const userSchema = new Schema(
  {
    username: { type: String, required: true, uniqe: true },
    fullName: { type: String },
    role:     { type: String, default: ROLES.USER, require: true },
    password: { type: String, required: true },
  },
  { versionKey: false }
);

const UserModel = model("User", userSchema);

UserModel.userResponse = async function(user) {
  return {username:user.username,fullName:user.fullName,role:user.role}
}

UserModel.usersResponse = async function(usersDB) {
  const users = []
  for (u in usersDB) {
    users.push({username:usersDB[u].username,fullName:usersDB[u].fullName,role:usersDB[u].role})
  }

  return users
}

module.exports = UserModel;
