import { Router } from "express"
import authRouter from "./auth.routes"
import userRouter from "./user.routes"

const v1Routes = Router()

v1Routes.use("/auths", authRouter)
v1Routes.use("/users", userRouter)

export default v1Routes
