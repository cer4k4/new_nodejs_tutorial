const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config.js");
const UserModel = require("./models/user.js");

const server = express();
server.use(express.json());

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

// User MongoDB model 
var users = mongoose.model(
'users',
    {
      id: { type: String },
      fullName: { type: String },
      password: { type: String },
    });

server.post("/user", async (req, res) => {
  body = req.body;
  const user = new UserModel(
    body["username"],
    body["fullName"],
    body["password"]
  );
  console.log(user);


  // Function call 
  const userres = await users.insertMany([user
  ]).then(function () {
    console.log("Data inserted")
    res.send(userres);
  }).catch(function (error) {
      console.log(error)
  });
});

server.get("/user", async (req, res) => {
  try {
    id = req.query["id"];
    if (!id) {
      res.send({ error: "id is required" });
    }
    const user = await users.findOne({ _id: id });
    if (!user) {
      res.send({ user: "user not found" });
    }
    res.send({ user });
  } catch (err) {
    console.error(err);
    res.send({ error: "Internal Server Error" });
  }
});

server.delete("/user",async (req,res) => {
  id = req.query["id"];
  // Function call 
  const user = await users.deleteOne({ '_id': id });
  console.log(user)
  res.send(user)
})

server.patch("/user", async (req, res) => {
  try {
    id = req.query["id"];
    const updateData = req.body;
    const result = await users.updateOne(
      { _id: id },
      { $set: {updateData} }
    );
    if (result.matchedCount === 0) {
      return res.send({ error: "User not found" });
    }
    res.send({ message: "User updated successfully", result });
  } catch (err) {
    console.error(err);
    res.send({ error: "Internal Server Error" });
  }
});

server.get("/users", async (req, res) => {
  try {
    const allUsers = await users.find({});
    res.send({ users: allUsers });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

GetDatabaseConnection().then(() => {
  server.listen(config.hostPort, () => {
    console.log(`server is run on port ${config.hostPort}`);
  });
});
