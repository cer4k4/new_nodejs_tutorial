const express = require("express");
const config = require("./config/config.js");
const baseRouter = require("./routes/baseRouter.js");
const connectToDb = require("./db/connect-to-db.js");
const superAdminSeeder = require("./seeder/super-admin.seeder.js");
const server = express();
server.use(express.json());
server.use("/", baseRouter);

const bootstrap = async () => {
  try {
    await connectToDb();
    await superAdminSeeder(config.adminUsername, config.adminPassword);

    server.listen(config.hostPort, () => {
      console.log(`server is run on port ${config.hostPort}`);
    });
  } catch (error) {
    console.log({ error });
  }
};

bootstrap();
