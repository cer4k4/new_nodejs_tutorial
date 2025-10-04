const { connect } = require("mongoose");
const config = require("../config/config");

async function connectToDb() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await connect(config.uri, { dbName: config.dbName });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
}

module.exports = connectToDb