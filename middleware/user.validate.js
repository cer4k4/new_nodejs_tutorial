const Joi = require('joi')
const jwt = require('jsonwebtoken');

var secretKey = "@dsf$sdsaxcxzxc213";

async function validateRegisterUser(user)
{
    const UserSchema = Joi.object({
        username: Joi.string()
                  .min(5)
                  .max(30)
                  .required(),
        fullName: Joi.string()
                  .min(3)
                  .max(90),
        password: Joi.string()
                  .max(20)
                  .required(),
          roleId: Joi.string().
                  required(),

    }).options({ abortEarly: false });
    return UserSchema.validate(user)
}

async function validateUserId(user)
{
    const UserSchema = Joi.object({
        id: Joi.string()
        .required(),
    }).options({ abortEarly: false });
    return UserSchema.validate(user)
}

async function validateLoginUser(user)
{
    const UserSchema = Joi.object({
        username: Joi.string()
                  .min(5)
                  .max(30)
                  .required(),
        password: Joi.string()
                  .max(20)
                  .required(),
    }).options({ abortEarly: false });
    return UserSchema.validate(user)
}

async function givePayload(req,res,next) {
    try{
        token = req.get("Authorization")
        if (!token) {
            res.status(400).send({"error":
                {
                    "name": "Authorization token",
                    "message": "token is nill"
                }
                })
        }
        const payload = jwt.verify(token, secretKey);
        req["payload"] = payload
            return next()
    } catch (err) {
        res.status(400).send({"error":err})
    }
}




module.exports = { validateRegisterUser , validateUserId , validateLoginUser , givePayload }