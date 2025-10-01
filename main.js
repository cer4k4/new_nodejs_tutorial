const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config.js");
const baseRouter = require("./routes/baseRouter.js")
const server = express();
server.use(express.json());
server.use("/", baseRouter)

async function GetDatabaseConnection() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await mongoose.connect(config.uri, { dbName: config.dbName });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
}

GetDatabaseConnection().catch(console.dir);

GetDatabaseConnection().then(() => {
  server.listen(config.hostPort, () => {
    console.log(`server is run on port ${config.hostPort}`);
  });
});
