const express = require('express');
const { MongoClient, ServerApiVersion } = require("mongodb");
const config = require('./config/config')
const server = express();
server.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(config.uri,  {
  serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
  }
});
let db
async function GetDatabaseConnection() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    db = client.db(config.dbName);
    console.log("✅ MongoDB connected")
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
}
GetDatabaseConnection().catch(console.dir);

server.post('/user',(req,res) => {
  res.send('Hi Ali');
})

server.get('/user', async (req,res) => {
  username = req.query['user_name']
  try {
    const users = db.collection('users');
    const dbuser = await users.findOne({ user_name: username});
    res.json(dbuser)
  } catch (err) {
    console.error(err)
    res.status(500).send("server error")
  }
})
GetDatabaseConnection().then(() => {
    server.listen(config.hostPort,() => {
    console.log(`server is run on port ${config.hostPort}`)
  });
})
