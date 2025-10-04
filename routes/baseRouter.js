const baseRouter = require("express").Router()
const userRouter = require("./userRouter")

baseRouter.use("/users", userRouter)

module.exports = baseRouter;