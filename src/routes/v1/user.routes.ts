import { Router } from "express"
import {
  createUserHandler,
  verifyUserHandler,
  forgotPasswordHandler,
} from "../../controllers/user.controller"
import { validateResource } from "../../middlewares/validateResource"
import { createUserSchema, verifyUserSchema, forgotPasswordSchema } from "../../schema/user.schema"

const router = Router()

router.post("/", validateResource(createUserSchema), createUserHandler)
router.post("/verify", validateResource(verifyUserSchema), verifyUserHandler)
router.post("/forgotpassword", validateResource(forgotPasswordSchema), forgotPasswordHandler)

export default router
