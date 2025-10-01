const RoleModel = require("../models/role.schema");
const RoleValidator = require("../middleware/role.validate");
const { ObjectId } = require("mongodb");

async function createRole (req, res) {
  try {
    body = req.body;
    const value = await RoleValidator.validateCreateRole(body)
    const rolename = body.rolename
    const description = body.description
    const permissionEndPoints = body.permissionEndPoints
    const newRole = await RoleModel.create({rolename,description,permissionEndPoints})
    res.json({ newRole })
  } catch (error) {
    console.log(error)
    res.send({ error });
  }
}

async function updateRole (req, res) {
  try {
    id = req.params['id'];
    const resultOfRoleId = await RoleValidator.validateRoleId(id)
    const updateData = req.body;
    const resultOfRoleValidation = await RoleValidator.validateCreateRole(updateData)
    const result = await RoleModel.updateOne(
      { _id: id },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.send({ error: "Role not found" });
    }else{
      res.send({ message: "Role updated successfully", result });
    }
  } catch (err) {
    console.error(err);
    res.send({ error: "Internal Server Error" });
  }
};

async function allRole (req, res) {
  try {
    const allRoles = await RoleModel.find({});
    res.send({ roles: allRoles });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function getRole(req, res) {
  try {
    id = req.params['id'];
    const resultOfRoleId = await RoleValidator.validateRoleId(id)
    const role = await RoleModel.findById(id)
    if (!role) {
      res.send({ role: "role not found" });
    } else {
        res.send({ role });
    }
  } catch (err) {
    console.error(err);
    res.send({ error: "Internal Server Error" });
  }
}

async function deleteRole(req,res) {    
  try {
      id = req.params['id'];
      const resultOfRoleId = await RoleValidator.validateRoleId(id)
      const role = await RoleModel.findByIdAndDelete(id);
      if (role === null) {
          res.send({ error:"role not found" })
      } else {
          res.send({ error:"role is deleted",role })
      }
  } catch (error) {
      res.send({ error });
  }
}


module.exports = {getRole,createRole,deleteRole,updateRole,allRole}