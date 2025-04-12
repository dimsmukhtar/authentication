import { Router } from "express"
import {
  createUserHandler,
  verifyUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  meHandler,
  logoutHandler,
} from "../../controllers/user.controller"
import { validateResource } from "../../middlewares/validateResource"
import authenticate from "../../middlewares/authenticate"
import {
  createUserSchema,
  verifyUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../schema/user.schema"

const router = Router()

router.post("/register", validateResource(createUserSchema), createUserHandler)
router.post("/verify", validateResource(verifyUserSchema), verifyUserHandler)
router.post("/forgotpassword", validateResource(forgotPasswordSchema), forgotPasswordHandler)
router.post("/resetpassword", validateResource(resetPasswordSchema), resetPasswordHandler)
router.get("/me", authenticate, meHandler)
router.post("/logout", authenticate, logoutHandler)

export default router
