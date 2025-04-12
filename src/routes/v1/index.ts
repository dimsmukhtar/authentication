import { Router } from "express"
import userRouter from "./user.routes"
import authRouter from "./auth.routes"

const v1Routes = Router()

v1Routes.use("/users", userRouter)
v1Routes.use("/auths", authRouter)

export default v1Routes
