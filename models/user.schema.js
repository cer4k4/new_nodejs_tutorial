const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {type: String, required: true, uniqe: true},
  fullName: {type: String},
  roleId: {type:String, default:"user" ,require:true},
  password: {type: String, required: true}
},{versionKey:false})

 const UserModel= model("User", userSchema)

 module.exports=UserModel
