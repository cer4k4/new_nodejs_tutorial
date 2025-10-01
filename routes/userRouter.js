const userRouter= require("express").Router()
const userController = require("../controllers/user")
const usermiddleware = require("../middleware/user.validate")
const rolemiddleware = require("../middleware/role.validate")

userRouter.post("/create",usermiddleware.givePayload,rolemiddleware.checkPermission, userController.registerUser)

userRouter.get("/byId/:id", usermiddleware.givePayload,rolemiddleware.checkPermission,userController.getUser)

userRouter.get("/list",usermiddleware.givePayload,rolemiddleware.checkPermission,userController.allUser)

userRouter.patch("/update/:id",usermiddleware.givePayload,rolemiddleware.checkPermission,userController.updateUser)

userRouter.delete("/delete/:id",usermiddleware.givePayload,rolemiddleware.checkPermission,userController.deleteUser)

userRouter.post("/login",userController.loginUser)

module.exports = userRouter;