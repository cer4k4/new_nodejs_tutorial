const userRouter= require("express").Router()
const userController = require("../controllers/user")
const middleware = require("../middleware/authentication_authorization")

userRouter.post("/create",userController.registerUser)

userRouter.get("/byId/:userId", middleware.authentication,middleware.authorization(["admin","user"]),userController.getUser)

userRouter.get("/list/:page/:limit",middleware.authentication,middleware.authorization(["admin"]),userController.allUser)

userRouter.patch("/update/:userId",middleware.authentication,middleware.authorization(["admin"]),userController.updateUser)

userRouter.delete("/delete/:userId",middleware.authentication,middleware.authorization(["admin"]),userController.deleteUser)

userRouter.post("/login",userController.loginUser)

module.exports = userRouter;