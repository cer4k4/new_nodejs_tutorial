const UserModel = require("../models/user.schema");
const Validate = require("../middleware/validator");
const auth = require("../middleware/authentication_authorization");
const { hash, compare } = require("bcrypt");

async function registerUser(req, res) {
  try {
    const resultOfUserValidation = await Validate.requestValidator('registerUser',req.body);
    if (resultOfUserValidation.error) {
      return res.status(400).json({"error" : resultOfUserValidation.error });
    }
    const username = req.body.username;
    const userFound = await UserModel.findOne({username});
    if (userFound) {
      return res.status(400).json({"error" : "username is existed" });
    }
    
    const fullName = req.body.fullName;
    const password = req.body.password;
    const hashedPassword = await hash(password, 10);
    const newUser = await UserModel.create({
      username,
      fullName,
      password: hashedPassword,
    });
    res.status(201).json({user: {username: newUser.username, fullName: newUser.fullName, role: newUser.role}});
  } catch ({error}) {
    res.status(500).send({ error });
  }
}

async function updateUser(req, res) {
  try {
    id = req.params["id"];
    const resultOfUserId = await Validate.validateUserId(id);
    if (resultOfUserId.error.message) {
      return res.status(400).json({"error" : resultOfUserId.error.message });
    }
    const updateData = req.body;
    const resultOfUserValidation = await Validate.requestValidator("registerUser",updateData);
    if (resultOfUserValidation.error) {
      return res.status(400).json({"error" : resultOfUserValidation.error.message });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(200).send({ user: "user not found" });
    }
    const isPasswordCorrect = UserModel.compairePassword(
      body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(200).send({ error: "password is incorecet" });
    }
    const result = await UserModel.updateOne({ _id: id }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.send({ error: "User not found" });
    } else {
      res.status(200).send({ message: "User updated successfully", result });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function allUser(req, res) {
  try {
    const limit = req.params['limit'];
    const resultOfLimit = await Validate.requestValidator("limit", limit);
    if (resultOfLimit.error) {
      return res.status(400).json({"error" : resultOfLimit.error.message });
    }
    const page = req.params['page'];
    const resultOfPage = await Validate.requestValidator("page", page);
    if (resultOfPage.error) {
      return res.status(400).json({"error" : resultOfPage.error.message });
    }
    const offset = (page - 1) * limit;

    const allUsers = await UserModel.find({}).skip(page).limit(limit);
    const users = await UserModel.usersResponse(allUsers)
    res.status(200).send({ users });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function getUser(req, res) {
  try {
    id = req.params["userId"];
    const resultOfUserId = await Validate.requestValidator("getById", id);
    if (resultOfUserId.error) {
      return res.status(400).json({"error" : resultOfUserId.error.message });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).send({ user: "user not found" });
    } else {
      res.status(200).send({ user });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function deleteUser(req, res) {
  try {
    id = req.params["userId"];
    const resultOfUserId = await Validate.requestValidator("getById", id);
    if (resultOfUserId.error) {
      return res.status(400).json({"error" : resultOfUserId.error.message });
    }
    const user = await UserModel.findByIdAndDelete(id);
    if (user === null) {
      res.status(404).send({ error: "user not found" });
    } else {
      const user = await UserModel.userResponse(user)
      res.status(200).send({ error: "user is deleted", user});
    }
  } catch (error) {
    res.status(500).send({ error });
  }
}

async function loginUser(req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const resultOfLoginValidation = await Validate.requestValidator("loginUser",req.body);
    if (resultOfLoginValidation.error) {
      return res.status(400).json({"error" : resultOfLoginValidation.error.message });
    }
    const userFound = await UserModel.findOne({username});
    if (!userFound) {
      res.status(404).json({"error" : "the user not Founded" });
    }

    if (!compare(password,userFound.password)) {
      res.status(400).json({"error" : "the username or password is wrong" });
    }

    const result = await auth.generateToken(userFound);
    return res.send({result});

  } catch (error) {
    console.log(error)
    return res.send({ error });
  }
}

module.exports = {
  getUser,
  registerUser,
  deleteUser,
  updateUser,
  allUser,
  loginUser,
};
