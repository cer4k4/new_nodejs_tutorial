const  UserModel = require("../models/user.schema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserValidator = require("../middleware/user.validate");
const { ObjectId } = require("mongodb");
var secretKey = "@dsf$sdsaxcxzxc213";

async function getUser(req, res) {
  try {
    id = req.payload.id;
    const resultOfUserId = await UserValidator.validateUserId(id)
    const user = await UserModel.findById(id)
    if (!user) {
      res.send({ user: "user not found" });
    } else {
        res.send({ user });
    }
  } catch (err) {
    console.error(err);
    res.send({ error: "Internal Server Error" });
  }
}

async function registerUser (req, res) {
  const saltRounds = 10;
  try {
    body = req.body;
    const resultOfUserValidation = await UserValidator.validateRegisterUser(body)
    const username = body.username
    const fullName = body.fullName
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(body.password, salt);
    const newUser = await UserModel.create({username,fullName,password})
    res.json({ newUser })
  } catch (error) {
    res.send({ error });
  }
}

async function deleteUser(req,res) {    
  try {
      id = req.params['id'];
      const resultOfUserId = await UserValidator.validateUserId(id)
      const user = await UserModel.findByIdAndDelete(id);
      if (user === null) {
          res.send({ error:"user not found" })
      } else {
          res.send({ error:"user is deleted",user })
      }
  } catch (error) {
      res.send({ error });
  }
}

async function updateUser (req, res) {
  try {
    id = req.params["id"];
    const resultOfUserId = await UserValidator.validateUserId(id)
    const updateData = req.body;
    const resultOfUserValidation = await UserValidator.validateRegisterUser(updateData)
    const user = await UserModel.findById(id)
    if (!user) {
      res.send({ user: "user not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
    if (!isPasswordCorrect)  {
      return res.send({"error":"password is incorecet"})
    }
    const result = await UserModel.updateOne(
      { _id: id },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.send({ error: "User not found" });
    }else{
        res.send({ message: "User updated successfully", result });
    }
  } catch (err) {
    console.error(err);
    res.send({ error: "Internal Server Error" });
  }
};

async function allUser (req, res) {
  try {
    const allUsers = await UserModel.find({});
    res.send({ users: allUsers });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
}


async function loginUser (req, res) {
  try {
    body = req.body;
    const resultOfLoginValidation = await UserValidator.validateLoginUser(body)
    const user = await UserModel.findOne({'username': body.username})
    if (!user) {
      return res.send({ error: "user not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
    if (!isPasswordCorrect)  {
      return res.send({"error":"password is incorecet"})  
    }
    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return res.send({ token });
    
  } catch (error) {
    return res.send({ error });
  }
}



module.exports = {getUser,registerUser,deleteUser,updateUser,allUser,loginUser}