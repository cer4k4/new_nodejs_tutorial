const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  hostAddress: process.env.HOST_ADDRESS,
  hostPort: process.env.HOST_PORT,
  dbName: process.env.DB_NAME,
  uri: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/`,
  // options: {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // }
};
