const Joi = require('joi')
const RoleModel = require("../models/role.schema");
const { ObjectId } = require("mongodb");

async function validateCreateRole(role)
{
    const RoleSchema = Joi.object({
    rolename: Joi.string()
              .max(300)
              .required(),
    description: Joi.string()
              .max(300),
    }).options({ abortEarly: false });
    RoleSchema.validate(role)
}

async function validateRoleId(roleid)
{
    const RoleSchema = Joi.object({
        id: Joi.string().required(),
    }).options({ abortEarly: false });
    return RoleSchema.validate(roleid)
}

async function checkPermission(req,res,next) {
    try {
        payload = req["payload"]
        const role = await RoleModel.findOne(payload.roleId)
        for (r in role){
            console.log(r)
        }
        next()
    } catch (err) {
        next(err)
    }
}


module.exports = { validateCreateRole , validateRoleId , checkPermission }