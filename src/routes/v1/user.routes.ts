import { Router } from "express"
import { createUserHandler, verifyUserHandler } from "../../controllers/user.controller"
import { validateResource } from "../../middlewares/validateResource"
import { createUserSchema, verifyUserSchema } from "../../schema/user.schema"

const router = Router()

router.post("/", validateResource(createUserSchema), createUserHandler)
router.post("/verify", validateResource(verifyUserSchema), verifyUserHandler)

export default router
