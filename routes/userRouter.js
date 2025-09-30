const userRouter= require("express").Router()
const userController = require("../controllers/user")
const usermiddleware = require("../middleware/user.validate")
const rolemiddleware = require("../middleware/role.validate")

userRouter.post("/create", userController.registerUser)

userRouter.get("/byId/:id", usermiddleware.givePayload,rolemiddleware.checkPermission,userController.getUser)

userRouter.get("/list",userController.allUser)

userRouter.patch("/update/:id",userController.updateUser)

userRouter.delete("/delete/:id",userController.deleteUser)

userRouter.post("/login",userController.loginUser)

module.exports = userRouter;