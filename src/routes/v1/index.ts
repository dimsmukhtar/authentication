import { Router } from "express"
import authRouter from "./auth.routes"

const v1Routes = Router()

v1Routes.use("/auth", authRouter)

export default v1Routes
