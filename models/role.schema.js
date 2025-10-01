const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
  roleId: {type: String, uniqe: true},
  description: {type: String},
  permissionEndPoints:{type:[String]},
},{versionKey:false})

 const RoleModel= model("Role", roleSchema)

 module.exports=RoleModel
 