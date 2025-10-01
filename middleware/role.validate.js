const Joi = require('joi')
const RoleModel = require("../models/role.schema");

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
        if (!req.params["id"]){
            const id = req.params["id"]
            suburl = req.originalUrl.replace(id, ":id");
            payload = req["payload"]
        }
        const role = await RoleModel.findById(payload.roleId)
        for (r in role.permissionEndPoints){
            if (suburl === role.permissionEndPoints[r]) {
                console.log(suburl,role.permissionEndPoints[r])
                return next()
            }
        }
       return res.send({"error":"you don't have permission to this endpoint"})
    } catch (err) {
        next(err)
    }
}


module.exports = { validateCreateRole , validateRoleId , checkPermission }