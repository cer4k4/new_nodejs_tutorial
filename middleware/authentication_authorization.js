const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.schema");
var secretKey = "@dsf$sdsaxcxzxc213";

authorization = (roles) => {
  return async (req, res, next) => {
    try {
      payload = req["payload"];
      for (r in roles) {
        if (payload.role === roles[r]) {
          return next();
        }
      }
      return res.status(403).send({ error: "you don't have permission to this endpoint" });
    } catch (err) {
      next(err);
    }
  };
}


async function authentication(req, res, next) {
  try {
    token = req.get("Authorization");
    if (!token) {
      res.status(401).send({
        error: {
          name: "Authorization token",
          message: "token is nill",
        },
      });
    }
    const payload = jwt.verify(token, secretKey);
    const user = await UserModel.findOne({username:payload.username});
    if (!user){
        res.status(404).json({"error" : "the user not Founded" });
    }
    req["payload"] = payload;
    req["user"] = user;
    return next();
  } catch (err) {
    res.status(401).send({ error: err });
  }
}

async function generateToken(user) {
  const payload = {
    username: user.username,
    role: user.role,
  };
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  var newDateObj = new Date();
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  };
  const expireAt = newDateObj.addHours(1);
  expireAt.toTimeString();
  return { token, expireAt };
}

module.exports = { authentication, authorization, generateToken };
