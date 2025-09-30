const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
  rolename: {type: String, required: true, uniqe: true},
  description: {type: String},
  permissionendpoints:{type:[String]},
},{versionKey:false})

 const RoleModel= model("Role", roleSchema)

 module.exports=RoleModel
 