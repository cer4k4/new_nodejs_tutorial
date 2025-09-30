const roleRouter= require("express").Router()
const roleController = require("../controllers/role")
const rolemiddleware = require("../middleware/role.validate")

roleRouter.post("/create",roleController.createRole)

roleRouter.get("/byId/:id", roleController.getRole)

roleRouter.get("/list",roleController.allRole)

roleRouter.put("/update/:id",roleController.updateRole)

roleRouter.delete("/delete/:id",roleController.deleteRole)

module.exports = roleRouter;