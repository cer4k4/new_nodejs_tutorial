const baseRouter = require("express").Router()
const userRouter = require("./userRouter")
const roleRouter = require("./roleRouter")

baseRouter.use("/users", userRouter)
baseRouter.use("/roles", roleRouter)

module.exports = baseRouter;