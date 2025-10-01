const roleRouter= require("express").Router()
const roleController = require("../controllers/role")
const usermiddleware = require("../middleware/user.validate")
const rolemiddleware = require("../middleware/role.validate")

roleRouter.post("/create",usermiddleware.givePayload,rolemiddleware.checkPermission,roleController.createRole)

roleRouter.get("/byId/:id",usermiddleware.givePayload,rolemiddleware.checkPermission, roleController.getRole)

roleRouter.get("/list",usermiddleware.givePayload,rolemiddleware.checkPermission,roleController.allRole)

roleRouter.put("/update/:id",usermiddleware.givePayload,rolemiddleware.checkPermission,roleController.updateRole)

roleRouter.delete("/delete/:id",usermiddleware.givePayload,rolemiddleware.checkPermission,roleController.deleteRole)

module.exports = roleRouter;