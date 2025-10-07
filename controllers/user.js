const UserModel = require("../models/user.schema");
const responseWriter = require("../utils/responseInterface");
const Validate = require("../middleware/validator");
const auth = require("../middleware/authentication_authorization");
const ROLES = require("../models/enum")
const { hash, compare } = require("bcrypt");

async function registerUser(req, res) {
  try {
    const resultOfUserValidation = await Validate.requestValidator('registerUser',req.body);
    if (resultOfUserValidation.error) {
      const response = await responseWriter(false,res.status(400)["statusCode"],{},resultOfUserValidation.error.message)
      return res.status(400).json(response);
    }
    const username = req.body.username;
    const userFound = await UserModel.findOne({username});
    if (userFound) {
      const response = await responseWriter(false,res.status(400)["statusCode"],{},"username is existed")
      return res.status(400).json(response);
    }
    const fullName = req.body.fullName;
    const password = req.body.password;
    const hashedPassword = await hash(password, 10);
    const newUser = await UserModel.create({
      username,
      fullName,
      password: hashedPassword,
    });

    const response = await responseWriter(true,res.status(201)["statusCode"],{username: newUser.username, fullName: newUser.fullName, role: newUser.role},"user is created")
    return res.status(201).json(response);
  } catch ({error}) {
    const response = await responseWriter(false,res.status(500)["statusCode"],{},"user is not created")
    res.status(500).send(response);
  }
}

async function updateUser(req, res) {
  try {
    const userid = req.params["userId"];
    const resultOfUserId = await Validate.requestValidator("getById",userid);
    if (resultOfUserId.error) {
      const response = await responseWriter(false,res.status(400)["statusCode"],{},resultOfUserId.error.message)
      return res.status(400).json(response);
    }
    const updateData = req.body;
    const resultOfUserValidation = await Validate.requestValidator("updateUser",updateData);
    if (resultOfUserValidation.error) {
      const response = await responseWriter(false,res.status(400)["statusCode"],{},resultOfUserValidation.error.message )
      return res.status(400).json(response);
    }
    const user = await UserModel.findById(userid)
    if (req['user'].role !== 'admin' && req['user'].username !== user.username) {
      const response = await responseWriter(false,res.status(403)["statusCode"],{},"you don't have permission to change this user")
      return res.status(403).json(response);      
    }
    if (req.body.newPassword) {
      if (! await compare(req.body.password,user.password)) {
        const response = await responseWriter(false,res.status(400)["statusCode"],{},"the username or password is wrong")
        return res.status(400).json(response);
      }
      const hashedPassword = await hash(req.body.newPassword, 10);
      user.password = hashedPassword
    }
    if (req.body.username){
      const userFound = await UserModel.findOne({username:req.body.username});
      if (userFound) {
        const response = await responseWriter(false,res.status(400)["statusCode"],{},"change the username is this username is taken by another user")
        return res.status(400).json(response);
      }
      user.username = req.body.username
    }
    if (req.body.role){
      if (req['user'].role !== 'admin') {
        const response = await responseWriter(false,res.status(403)["statusCode"],{},"you don't have permission to change role")
        return res.status(403).json(response);
      }
      if (! await checkRoles(req.body.role)){
        const response = await responseWriter(false,res.status(404)["statusCode"],{},"this role is not definde")
        return res.status(404).json(response);
      }
      user.role = req.body.role
    }
    user.fullName = req.body.fullName
    const result = await UserModel.updateOne({ _id: userid }, { $set: user});
    if (result.matchedCount === 0) {
      const response = await responseWriter(false,res.status(404)["statusCode"],{},"User not found")
      return res.status(404).send(response);
    } else {
      const response = await responseWriter(true,res.status(200)["statusCode"],result,"User updated successfully")
      res.status(200).send(response);
    }
  } catch (err) {
    console.error(err);
    const response = await responseWriter(false,res.status(500)["statusCode"],{},err.message)
    res.status(500).send(response);
  }
}

async function allUser(req, res) {
  try {
    const limit = Number(req.params['limit']);
    if (!limit || limit <= 0){
      limit += Number(10)
    }
    const resultOfLimit = await Validate.requestValidator("limit", limit);

    if (resultOfLimit.error) {
      const response = await responseWriter(false,res.status(400)["statusCode"],{},resultOfLimit.error.message)
      return res.status(400).json(response);
    }
    const page = Number(req.params['page'])
    if (!page || page <= 0){
      page += Number()
    }
    const resultOfPage = await Validate.requestValidator("page", page);
    if (resultOfPage.error) {
      const response = await responseWriter(false,res.status(400)["statusCode"],{},resultOfPage.error.message )
      return res.status(400).json(response);
    }
    const offset = (page - 1) * limit;

    const allUsers = await UserModel.find({}).skip(offset).limit(limit);

    const users = await UserModel.usersResponse(allUsers)
    const response = await responseWriter(true,res.status(200)["statusCode"],users,"successful get all users" )
    return res.status(200).send(response);
  } catch (err) {
    console.error(err);
    const response = await responseWriter(false,res.status(500)["statusCode"],{},err.message)
    res.status(500).send(response);
  }
}

async function getUser(req, res) {
  try {
    id = req.params["userId"];
    const resultOfUserId = await Validate.requestValidator("getById", id);
    if (resultOfUserId.error) {
      const response = await responseWriter(false,res.status(400)["statusCode"],{},resultOfUserId.error.message)
      return res.status(400).json(response);
    }
    const user = await UserModel.findById(id);
    if (!user) {
      const response = await responseWriter(false,res.status(404)["statusCode"],{},"user not found")
      return res.status(404).send(response);
    } else {
      const response = await responseWriter(true,res.status(200)["statusCode"],user,"successful get user")
      return res.status(200).send(response);
    }
  } catch (err) {
    const response = await responseWriter(false,res.status(500)["statusCode"],{},err.message)
    res.status(500).send(response);
  }
}

async function deleteUser(req, res) {
  try {
    id = req.params["userId"];
    const resultOfUserId = await Validate.requestValidator("getById", id);
    if (resultOfUserId.error) {
      const response = await responseWriter(false,res.status(400)["statusCode"],{},resultOfUserId.error.message)
      return res.status(400).json(response);
    }
    const user = await UserModel.findByIdAndDelete(id);
    if (user === null) {
      const response = await responseWriter(false,res.status(404)["statusCode"],{},"user not found")
      return res.status(404).send(response);
    } else {
      const response = await responseWriter(true,res.status(200)["statusCode"],user,"user is deleted")
      const user = await UserModel.userResponse(user)
      return res.status(200).send(response);
    }
  } catch (error) {
    const response = await responseWriter(false,res.status(500)["statusCode"],{},err.message)
    res.status(500).send({ error });
  }
}

async function loginUser(req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const resultOfLoginValidation = await Validate.requestValidator("loginUser",req.body);
    if (resultOfLoginValidation.error) {
      const response = await responseWriter(false,res.status(400)["statusCode"],{},resultOfLoginValidation.error.message)
      return res.status(400).json(response);
    }
    const userFound = await UserModel.findOne({username});
    if (!userFound) {
      const response = await responseWriter(false,res.status(404)["statusCode"],{},"the user not Founded")
      return res.status(404).json(response);
    }
    if ( ! await compare(password,userFound.password)) {
      const response = await responseWriter(false,res.status(400)["statusCode"],{},"the username or password is wrong")
      return res.status(400).json(response);
    }
    const response = await responseWriter(true,res.status(200)["statusCode"],await auth.generateToken(userFound),"successful login, wellcome to our system")
    return res.send(response);

  } catch (error) {
    console.log(error)
    const response = await responseWriter(false,res.status(500)["statusCode"],{},error.message)
    return res.send(response);
  }
}



async function checkRoles(role) {
  for (r in ROLES){
    if (role === ROLES[r]) {
      return true
    }
  }
  return false
}

module.exports = {
  getUser,
  registerUser,
  deleteUser,
  updateUser,
  allUser,
  loginUser,
};
