import { Router } from "express"
import userRouter from "./user.routes"

const v1Routes = Router()

v1Routes.use("/users", userRouter)

export default v1Routes
